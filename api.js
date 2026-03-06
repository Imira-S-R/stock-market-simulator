export async function get_company_info(symbol) {

    const res = await fetch(`${import.meta.env.VITE_API_URL}/company_info`,
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                symbol: symbol
            })
        }
    )


    if (!res.ok) {
        return { error: 'error' }
    }

    const data = await res.json()


    return data
}

export async function get_company_chart_info(companyId) {
    let _chartData = []
    let _chartLabel = []

    const res = await fetch(`${import.meta.env.VITE_API_URL}/get_company_chart_info`,
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                companyId: companyId
            })
        }
    )


    if (!res.ok) {
        return { error: 'error' }
    }

    const data = await res.json()

    for (const chartData of data.chartData) {
        const timestamp = chartData.t; // milliseconds
        const date = new Date(timestamp);
        const day = date.getDate();
        _chartLabel.push(day)
        _chartData.push(chartData.p)
    }

    return [_chartLabel, _chartData]

}

export async function get_user_wishlist() {
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/get_wishlist`, { credentials: 'include' })
        const data = await res.json()
        return data
    } catch (err) {
        console.log(err)
    }
}

export async function add_to_wishlist(symbol) {
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/add_to_wishlist`,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    symbol: symbol
                }),
                credentials: 'include'
            },
        )

        if (res.ok) {
            console.log('hooray', symbol)
        }
    } catch (err) {
        console.log(err)
    }
}

export async function remove_from_wishlist(symbol) {
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/remove_from_wishlist`,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    symbol: symbol
                }),
                credentials: 'include'
            },
        )

        if (res.ok) {
            console.log('hooray', symbol)
        }
    } catch (err) {
        console.log(err)
    }
}