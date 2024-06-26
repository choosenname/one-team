"use client";

import * as z from "zod";
import {useEffect, useState, useTransition} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegisterSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { CardWrapper } from "@/components/auth/card-wrapper"
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { register } from "@/actions/register";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Department} from "@prisma/client";
import axios from "axios";
import {inviteUser} from "@/actions/invite";
import {TimePickerDemo} from "@/components/time-picker/time-picker-demo";

export const RegisterForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: "",
            password: "",
            departmentId: "",
            post: "",
            office: "",
            startWork: new Date(),
            endWork: new Date(),
        },
    });

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            register(values)
                .then((data) => {
                    setSuccess(data.success);
                    setError(data.error);
                    if(data.user) inviteUser(data.user)
                });
        });
    };

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('/api/departments');
                setDepartments(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchDepartments();
    }, []);

    return (
        <CardWrapper
            headerLabel="Создать акаунт"
            backButtonLabel="Админ панель"
            backButtonHref="/admin"
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Имя</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="John Doe"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Пароль</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="******"
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="post"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Должность</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder=""
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="office"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Кабинет</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder=""
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="startWork"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Время начала работы</FormLabel>
                                    <FormControl>
                                        <TimePickerDemo
                                            setDate={field.onChange}
                                            date={field.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endWork"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Время конца работы</FormLabel>
                                    <FormControl>
                                        <TimePickerDemo
                                            setDate={field.onChange}
                                            date={field.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="departmentId"
                            render={({field}) => (<FormItem>
                                <FormLabel
                                    className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                    Выбрать отдел
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select department"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {departments.map((department) => (
                                            <SelectItem key={department.id} value={department.id}>
                                                {department.department}
                                            </SelectItem>))}
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>)}
                        />
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button
                        disabled={isPending}
                        type="submit"
                        className="w-full"
                    >
                        Создать аккаунт
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};