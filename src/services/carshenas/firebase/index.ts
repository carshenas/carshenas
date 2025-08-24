import carshenasService from "@/services";

export const submitFCMTokenService = (token: string) => {
    const body = {
        registrationToken: token,
    };

    return carshenasService.post<{
        registrationToken: string;
    }>("/notification/", {
        body, headers: {
            "Content-Type": "application/json",
        },
    });
};
