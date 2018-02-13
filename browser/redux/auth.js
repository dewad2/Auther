import axios from 'axios'

//action
const LOGIN_USER = 'LOGIN_USER'

//action creator
export function loginUser(user){
    return {
        type:LOGIN_USER,
        user,
    }
}
//thunk creator

export function login(credentials){

    return function (dispatch){
        axios.put(`/auth/local/login`, credentials)
        .then(res =>{
            console.log("res!!!!",res.data)
            res.data})
        .then(user => {
            console.log(user)
            dispatch(loginUser(user))
            }
        )
        .catch(err => console.error(`Logging in: ${credentials.email} unsuccessful`, err));

    }
}



//reducer

export default function reducer(user = {}, action) {

    switch(action.type){
        case LOGIN_USER:
        return action.user
    default:
        return user
    }
}
