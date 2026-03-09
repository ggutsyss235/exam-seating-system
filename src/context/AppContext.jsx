import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    // Auth State
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('examUser');
        return saved ? JSON.parse(saved) : null;
    });

    // App State
    const [students, setStudents] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [seatingPlan, setSeatingPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    // Setup axios instance based on environment
    const api = axios.create({
        baseURL: import.meta.env.DEV ? 'http://localhost:5000/api' : '/api',
    });

    // Auto-inject token
    api.interceptors.request.use((config) => {
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    });

    // Handle logout on token expiry
    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                logout();
            }
            return Promise.reject(error);
        }
    );

    // Load initial data from backend if user exists
    useEffect(() => {
        if (user) {
            fetchData();
        } else {
            // Reset state if no user
            setStudents([]);
            setRooms([]);
            setSeatingPlan(null);
        }
    }, [user]);

    // Save user to localStorage when it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('examUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('examUser');
        }
    }, [user]);

    // Sync to backend whenever data changes (debounced)
    const syncTimeoutRef = useRef(null);
    useEffect(() => {
        if (!user || isLoading) return; // Don't sync while initial loading

        if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);

        syncTimeoutRef.current = setTimeout(() => {
            syncDataToBackend();
        }, 1000); // 1s debounce

        return () => clearTimeout(syncTimeoutRef.current);
    }, [students, rooms, seatingPlan]);

    // ====================
    // API Actions
    // ====================

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        setUser(data);
    };

    const register = async (userData) => {
        const { data } = await api.post('/auth/register', userData);
        setUser(data);
    };

    const logout = () => {
        setUser(null);
    };

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const { data } = await api.get('/data');

            // Avoid triggering the sync observer during initial load
            setStudents(data.students || []);
            setRooms(data.rooms || []);
            setSeatingPlan(data.seatingPlan || null);

            // Give React a tiny bit of time to update state before lifting lock
            setTimeout(() => setIsLoading(false), 100);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            setIsLoading(false);
        }
    };

    const syncDataToBackend = async () => {
        try {
            setIsSyncing(true);
            await api.put('/data', { students, rooms, seatingPlan });
            setTimeout(() => setIsSyncing(false), 500);
        } catch (error) {
            console.error("Failed to sync data:", error);
            setIsSyncing(false);
        }
    };

    // ====================
    // Local Logic Actions
    // ====================

    const addStudent = (studentData) => {
        setStudents(prev => [...prev, { ...studentData, id: Date.now().toString() }]);
    };

    const removeStudent = (id) => {
        setStudents(prev => prev.filter(s => s.id !== id));
    };

    const addRoom = (roomData) => {
        setRooms(prev => [...prev, { ...roomData, id: Date.now().toString() }]);
    };

    const removeRoom = (id) => {
        setRooms(prev => prev.filter(r => r.id !== id));
    };

    return (
        <AppContext.Provider value={{
            user, login, register, logout,
            students, addStudent, removeStudent,
            rooms, addRoom, removeRoom,
            seatingPlan, setSeatingPlan,
            isLoading, isSyncing
        }}>
            {children}
        </AppContext.Provider>
    );
};
