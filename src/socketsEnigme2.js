// eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
const initSocketsEnigme2 = (io, socket) => {
    const dataPopups = [
        {
            id: 1, 
            text: `popup n°${this.id}`
        },
        {
            id: 2, 
            text: `popup n°${this.id}`
        },
        {
            id: 3, 
            text: `popup n°${this.id}`
        },
        {
            id: 4, 
            text: `popup n°${this.id}`
        },
        {
            id: 5, 
            text: `popup n°${this.id}`
        },
        {
            id: 6, 
            text: `popup n°${this.id}`
        }
    ]

    socket.on('sendPopups', () => {
        io.to(socket.idRoom).emit('sendPopups', dataPopups)
        // console.log('sendPopups', socket)
    })

    socket.on('popupIsReady', () => {
        console.log('popupIsReady');
        io.to(socket.idRoom).emit('sendPopupToPlayer')
        
    })

    socket.on('p2pPopup', () => {
        io.to(socket.idRoom).emit('popupTransfer')
        
    })

}

module.exports = { initSocketsEnigme2 }
