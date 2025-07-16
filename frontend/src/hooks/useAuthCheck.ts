import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../lib/api";
import { setUser, setLoading, setError } from "../store/authSlice";
import { type RootState } from "../store/types";

export const useAuthCheck = () => {
    const dispatch = useDispatch();
    const { user, loading } = useSelector((state: RootState) => state.auth);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            dispatch(setLoading(true));
            try {
                const res = await api.get("/auth/refresh", { withCredentials: true });

                const data = res.data
                if (data?.user && data?.accessToken) {
                    localStorage.setItem("accessToken", res.data.accessToken)
                    dispatch(setUser(res.data.user));
                } else {
                    throw Error()
                }
            } catch (err: any) {
                dispatch(setUser(null));
                dispatch(setError(err.response?.data?.message || "Not authenticated"));
            } finally {
                dispatch(setLoading(false));
                setChecked(true);
            }
        };

        if (!user) checkAuth();
        else setChecked(true);
    }, [user, dispatch]);

    return { user, loading, checked };
};
