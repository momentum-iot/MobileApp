import { checkRepository } from "@/src/data/repositories/CheckRepository";
import { CheckInUseCase } from "@/src/domain/usecases/CheckInUseCase";
import { CheckOutUseCase } from "@/src/domain/usecases/CheckOutUseCase";
import { GetConcurrencyUseCase } from "@/src/domain/usecases/GetConcurrencyUseCase";
import { GetUserStatusUseCase } from "@/src/domain/usecases/GetStatusUseCase";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAuth } from "@/src/presentation/context/AuthContext";

const checkInUseCase = new CheckInUseCase(checkRepository);
const checkOutUseCase = new CheckOutUseCase(checkRepository);
const getConcurrencyUseCase = new GetConcurrencyUseCase(checkRepository);
const getUserStatusUseCase = new GetUserStatusUseCase(checkRepository);

interface CheckContextData {
    isInside: boolean;
    concurrency: number;
    isLoading: boolean;
    checkIn: () => Promise<string>;
    checkOut: () => Promise<string>;
    refreshStatus: () => Promise<void>;
    refreshConcurrency: () => Promise<void>;
}

const CheckContext = createContext<CheckContextData>({} as CheckContextData);

interface CheckProviderProps {
    children: ReactNode;
}

export function CheckProvider({ children }: CheckProviderProps) {
    const { user } = useAuth();
    const [isInside, setIsInside] = useState(false);
    const [concurrency, setConcurrency] = useState(0);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {

        if (!user) return;

        loadInitialData();


        const interval = setInterval(() => {
            refreshConcurrency();
        }, 60000);

        return () => clearInterval(interval);
    }, [user]);

    const loadInitialData = async () => {
        await Promise.all([
            refreshStatus(),
            refreshConcurrency(),
        ]);
    };

    const refreshStatus = async () => {
        try {
            const status = await getUserStatusUseCase.execute();
            setIsInside(status);
        } catch (error) {
            console.error('Error refreshing status:', error);
        }
    };

    const refreshConcurrency = async () => {
        try {
            const count = await getConcurrencyUseCase.execute();
            setConcurrency(typeof count === 'number' && !isNaN(count) ? count : 0);
        } catch (error) {
            console.error('Error refreshing concurrency:', error);
            setConcurrency(0);
        }
    };

    const checkIn = async (): Promise<string> => {
        setIsLoading(true);
        try {
            const message = await checkInUseCase.execute();
            await refreshStatus();
            await refreshConcurrency();
            return message;
        } catch (error: any) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const checkOut = async (): Promise<string> => {
        setIsLoading(true);
        try {
            const message = await checkOutUseCase.execute();
            await refreshStatus();
            await refreshConcurrency();
            return message;
        } catch (error: any) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <CheckContext.Provider
            value={{
                isInside,
                concurrency,
                isLoading,
                checkIn,
                checkOut,
                refreshStatus,
                refreshConcurrency,
            }}
        >
            {children}
        </CheckContext.Provider>
    );
}

export function useCheck() {
    const context = useContext(CheckContext);

    if (!context) {
        throw new Error('useCheck must be used within a CheckProvider');
    }

    return context;
}


