"use client";

import React, { useState } from "react";
import {
    Box,
    Container,
    Typography,
    Paper,
    Stack,
    TextField,
    Button,
} from "@mui/material";
import { api } from '@/lib/api';
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import { useAppContext } from "../AppContext";
import { useRouter } from "next/navigation";

export default function Register() {
    const { setIsLoggedIn, setResponse } = useAppContext();
    const router = useRouter();

    const labels = {
        knap: 'Registrer',
        emailfejl: 'Hvad med din email???',
        passwordFejl: 'Du skal bruge password for at logge ind',
        email: 'E-mail',
        name: 'Navn'
    }
    const { knap, emailfejl, passwordFejl, email, name } = labels;
    const schema = Yup.object().shape({
        email: Yup.string().required(emailfejl),
        name: Yup.string().required(name),
        password: Yup.string().required(passwordFejl)
    })

    const defaultValues = {
        email: '',
        name: '',
        password: '',
    }

    const [message, setMessage] = useState()
    const [isLoading, setIsLoading] = useState(false);

    const { handleSubmit, formState: { errors }, control } = useForm({
        defaultValues,
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {
        try {
            setIsLoading(true)
            const register = await api.post('/newuser', data);
            if (register.data.auth) {
                setResponse(register.data.auth);
                router.push('/dashboard');
            }
        } catch (error) {
            console.log(error.response);
            setMessage(
                error.response?.data?.message || 'Noget gik galt'
            );
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>

            {/* navbar spacer */}
            <Box sx={{ height: { xs: 70, md: 80 } }} />
            <form onSubmit={handleSubmit(onSubmit)}>
                <Container maxWidth="sm">
                    <Paper
                        elevation={3}
                        sx={{
                            p: 4,
                            mt: 6,
                            borderRadius: 3,
                        }}
                    >
                        <Typography
                            variant="h4"
                            sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}
                        >
                            {knap}
                        </Typography>

                        <Stack spacing={3}>

                            <Controller
                                name="email"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: true,
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        autoFocus
                                        label={email}
                                        type="email"
                                        fullWidth
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="name"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: true,
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        autoFocus
                                        label={name}
                                        type="text"
                                        fullWidth
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="password"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: true,
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Password"
                                        type="password"
                                        fullWidth
                                        error={!!errors.password}
                                        helperText={errors.password?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="confirmPassword"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: true,
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Confirm Password"
                                        type="password"
                                        fullWidth
                                        error={!!errors.confirmPassword}
                                        helperText={errors.confirmPassword?.message}
                                    />
                                )}
                            />
                            <Box sx={{ color: "error.main", textAlign: "center" }}>
                                {message}
                            </Box>

                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={isLoading}
                                sx={{
                                    py: 1.5,
                                    fontWeight: "bold",
                                }}
                            >
                                {knap}
                            </Button>

                        </Stack>
                        <Typography variant="body2" sx={{ textAlign: "center" }}>
                            Har du ikke en konto? <a href="/register">Opret bruger</a>
                        </Typography>
                    </Paper>
                </Container>
            </form>
        </Box>
    );
}