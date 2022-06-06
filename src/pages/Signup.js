import React, {useEffect} from 'react';
import {Anchor, Button, Container, Group, Paper, PasswordInput, Text, TextInput, Title,} from '@mantine/core';
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {clearState, exchangeToken, signupUser, userSelector} from "../app/userSlice";
import {useForm} from "@mantine/form";

export function SignUp() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {isSuccess, isError} = useSelector(
        userSelector
    );

    useEffect(() => {
        return () => {
            dispatch(clearState());
        };
    }, []);

    useEffect(() => {
        if (isError) {
            dispatch(clearState());
        }

        if (isSuccess) {
            dispatch(clearState());
            dispatch(exchangeToken({accessToken: localStorage.getItem('accessToken')}))
            navigate('/');
        }
    }, [isError, isSuccess]);

    const form = useForm({
        initialValues: {
            username: "",
            email: "",
            password: "",
            password_confirm: "",
        },
        validate: (values) => ({
            password: values.password !== values.password_confirm ? "Пароли не совпадают" : null,
            password_confirm: values.password !== values.password_confirm ? "Пароли не совпадают" : null
        })
    })

    const handleSubmit = (values) => {
        dispatch(signupUser(values));
    }

    return (
        <Container size={420} my={40}>
            <Title
                align="center"
                sx={(theme) => ({fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900})}
            >
                Добро пожаловать!
            </Title>
            <Text color="dimmed" size="sm" align="center" mt={5}>
                Есть аккаунт?{' '}
                <Anchor
                    component={Link}
                    to={"/signin"}
                    size="sm">
                    Вход
                </Anchor>
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput label="Имя пользователя" placeholder="username"
                               required {...form.getInputProps("username")}/>
                    <TextInput label="Email" placeholder="you@mantine.dev" required
                               mt="md" {...form.getInputProps("email")}/>
                    <PasswordInput label="Пароль" placeholder="Your password" required
                                   mt="md" {...form.getInputProps("password")}/>
                    <PasswordInput label="Пароль еще раз" placeholder="Your password" required
                                   mt="md" {...form.getInputProps("password_confirm")}/>
                    <Button fullWidth mt="xl" type={"submit"}>
                        Зарегистрироваться
                    </Button>
                    <Group position="center" mt="md">
                        {/*<Checkbox label="Remember me"/>*/}
                        <Anchor component={Link} to={"/forgot"} size="sm">
                            Забыли пароль?
                        </Anchor>
                    </Group>
                </form>
            </Paper>
        </Container>
    )
}