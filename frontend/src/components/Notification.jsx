const Notification = ({message}) => {
    if (!message) return null

    console.log(message)
    return (
        <div className={`notification ${message.type}`}>
            {message.message}
        </div>
    )
}

export default Notification