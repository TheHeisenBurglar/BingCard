import { redirect } from "next/navigation";
import { SignupFormSchema, FormState } from "../lib/definitions";
import { createSession, deleteSession } from "../lib/session.server";

export async function signup(state: FormState, formData: FormData) {
    // Validate form fields
    const validatedFields = SignupFormSchema.safeParse({
        username: formData.get('username'),
        password: formData.get('password')
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    // Convert FormData to plain object
    const plainData = {
        username: formData.get('username'),
        password: formData.get('password'),
    };

    try {
        const response = await fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(plainData),
        });

        if (!response.ok) {
            return {
                message: "An error occurred while creating your account"
            };
        }

        const result = await response.json(); // Parse the response as JSON

        const user = result.data;

        if (!user) {
            return {
                message: "User creation failed. Please try again.",
            };
        }

        // Return success or do something else
        await createSession(user._id, user.username)
        redirect('/');

    } catch (error) {
        console.error(error);
        return {
            message: "Server error. Please try again later."
        };
    }
}
export async function logout() {
    await deleteSession()
    redirect('/login')
}