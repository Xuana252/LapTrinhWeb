'use server'
export const changePassword = async (payload) => {
    const { currentPassword, newPassword, account_id } = payload;

    try {
        // Fetch the account details by ID
        const accountResponse = await fetch(`${process.env.APP_URL}/accounts/${account_id}`);

        if (!accountResponse.ok) {
            return { status: false, message: "Failed to fetch account details." };
        }

        const account = await accountResponse.json();

        // Compare the current password with the fetched account password
        if (account.password !== currentPassword) {
            return { status: false, message: "Current password is incorrect." };
        }

        // Prepare the PATCH request payload
        const patchBody = {
            password: newPassword
        };

        // Send the PATCH request to update the password
        const patchResponse = await fetch(`${process.env.APP_URL}/accounts/${account_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patchBody)
        });

        if (patchResponse.ok) {
            return { status: true, message: "Password changed successfully. Please login again" };
        } else {
            return { status: false, message: "Failed to update password." };
        }
    } catch (error) {
        console.log("An error occurred:", error);
        return { status: false, message: "An unexpected error occurred. Please try again later." };
    }
};



export const login = async (payload) => {
    try {
        const response = await fetch(`${process.env.APP_URL}/auth/login/store`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        });
        
        const statusCode = response.status;
        
        if (response.ok) {
            const data = await response.json();
            return { statusCode, data };
        }
        
        // Handle cases where response is not OK but a status code exists
        return { statusCode, data: null };
    } catch (error) {
        console.error(error);
        return { statusCode: null, error: error.message }; // Add error details
    }
};
