export class errorClass{
    constructor(title,status,messages){
        this.title=title
        this.status=status
        this.messages=messages
    }
    addmessages(message){
        this.messages=[...this.messages,message]
    }
    noErrorsPresent(){
        return this.messages.length===0
    }

}