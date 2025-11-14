import { heartRateRepository } from "@/src/data/repositories/HeartRateRepository";
import { HeartRate } from "@/src/domain/entities/HeartRate";
import { GetHeartRateHistoryUseCase } from "@/src/domain/usecases/GetHeartRateHistoryUseCase";
import { SaveHeartRateUseCase } from "@/src/domain/usecases/SaveHeartRateUseCase";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const saveHeartRateUseCase = new SaveHeartRateUseCase(heartRateRepository)
const getHeartRateHistoryUseCase = new GetHeartRateHistoryUseCase(heartRateRepository)

interface HeartRateContextData {
    history: HeartRate[];
    isLoading: boolean;
    saveHeartRate: (bpm: number) => Promise<void>;
    refreshHistory: () => Promise<void>;
}

const HeartRateContext = createContext<HeartRateContextData>({} as HeartRateContextData);

interface HeartRateProviderProps {
    children: ReactNode;
}

export function HeartRateProvider({ children }: HeartRateProviderProps) {
    const { user } = useAuth();

    const [history, setHistory] = useState<HeartRate[]>([]);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        if (!user) return;
        loadInitialData();
    }, [user]);

    const loadInitialData = async () => {
        await refreshHistory();
    };


    const refreshHistory = async () => {
        if (!user) return;

        try {
            const response = await getHeartRateHistoryUseCase.execute(user.id);
            setHistory(response.history);
        } catch (error) {
            console.error("Error refreshing heart rate history:", error);
        }
    };


    const saveHeartRate = async (bpm: number): Promise<void> => {
        if (!user) return;

        setIsLoading(true);
        try {
            await saveHeartRateUseCase.execute(user.id, bpm);
            await refreshHistory();
        } catch (error) {
            console.error("Error saving heart rate:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <HeartRateContext.Provider
            value={{
                history,
                isLoading,
                saveHeartRate,
                refreshHistory,
            }}
        >
            {children}
        </HeartRateContext.Provider>
    );
}

export function useHeartRate() {
    const context = useContext(HeartRateContext);

    if (!context) {
        throw new Error("useHeartRate must be used within a HeartRateProvider");
    }

    return context;
}