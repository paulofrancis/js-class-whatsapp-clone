const functions = require('firebase-functions');
let admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

let db = admin.firestore();

function toB64(string) {
    return Buffer.from(string).toString('base64');
}

function fromB64(b64) {
    return Buffer.from(b64, 'base64').toString();
}

exports.saveLastMessage = functions
    .firestore
    .document('/chats/{chatId}/messages/{messageId}')
    .onCreate((change, context) => {

        let chatId = context.params.chatId;
        let messageId = context.params.messageId;

        console.log('[CHAT ID]', chatId);
        console.log('[MESSAGE ID]', messageId);

        return new Promise((resolve, reject) => {

            let chatRef = db.collection('chats').doc(chatId);

            chatRef.onSnapshot(snapChat => {

                let chatDoc = snapChat.data();

                console.log('[CHAT DATA]', chatDoc);

                let messageRef = chatRef.collection('messages').doc(messageId).onSnapshot(snapMessage => {

                    let messageDoc = snapMessage.data();

                    console.log('[MESSAGE DATA]', messageDoc);

                    let userFrom = messageDoc.from;
                    let userTo = Object.keys(chatDoc.users).filter(key => {
                        return (key !== toB64(userFrom))
                    })[0];

                    console.log('[FROM]', userFrom);
                    console.log('[TO]', userTo);

                    db.collection('users')
                        .doc(fromB64(userTo))
                        .collection('contacts')
                        .doc(toB64(userFrom))
                        .set({
                            lastMessage: messageDoc.content,
                            lastMessageTime: new Date()
                        }, {
                            merge: true
                        })
                        .then(e => {

                            console.log('[FINISH]', new Date());

                            resolve(e);
                            return true;
                        })
                        .catch(err => {

                            console.log('[ERROR]', err);

                            throw new Error(err);
                        });
                }, err => {

                    console.log('SNAPMESSAGE ERROR', err);
                    throw new Error(err);

                });
            });

        });

    });