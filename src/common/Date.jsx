let months=["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"]
let day=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"]

export const getDay=(timestamp)=>{
    let date=new Date(timestamp)
    return `${date.getDate()} ${months[date.getMonth()]}`
}

export const getFullDay=(timestamp)=>{
    let date=new Date(timestamp)

    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}
