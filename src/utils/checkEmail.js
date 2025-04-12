const isInvalidEmail = async (email) => {
    try {
        const res = await fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=1672275548244635b4166f63a9f251b2&email=${email}`)
        if (!res) {
            throw new Error('Failed to fetch email validation API')
        }
        const data = await res.json();
        if (data.is_disposable_email.value || !data.is_valid_format.value) return true

        return false
    } catch (e) {
        console.error('Fetch error:', error);
    }
}

module.exports = isInvalidEmail