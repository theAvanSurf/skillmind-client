export default async function getData(){
    const response = await fetch("asdkasla",{
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({key: "value"})
    })

    return response.json()
}