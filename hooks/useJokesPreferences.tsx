import { useState, useEffect } from 'react';
import { api } from "../api/api";
import { useIsFocused } from '@react-navigation/native';
import { UserDataManager } from '../services/userDataManager';

export const useJokesPreferences = (criteria?: object) => {
    const [jokes, setJokes] = useState({ liked: [], disliked: [] });
    const isFocused = useIsFocused();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchJokes = async () => {
            if (isFocused && isMounted) {
                setIsLoading(true);
                try {
                    const token = await UserDataManager.getToken();
                    const { userId, contestId } = criteria;

                    if (!userId || !contestId) {
                        setIsLoading(false);
                        return;
                    }

                    const endpoint = `/joke/preferences?userId=${userId}&contestId=${contestId}`;
                    const jokes_result = await api("GET", endpoint, undefined, token);
                    console.log(jokes_result);

                    if (isMounted) {
                        setJokes(jokes_result); 
                    }
                } catch (error) {
                    console.error("Failed to fetch jokes preferences:", error);
                }
                setIsLoading(false);
            }
        };

        fetchJokes();

        return () => { isMounted = false; };
    }, [isFocused, criteria]);

    return { jokes, isLoading };
};