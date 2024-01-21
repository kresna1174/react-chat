import { useEffect, useState } from "react";
import Pusher from "pusher-js";

function App() {

  const [username, setUsername] = useState('username')
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  let allMessages = []

  useEffect(() => {
    Pusher.logToConsole = true;

    let pusher = new Pusher('8810ee0117e1eeeece9d', {
      cluster: 'mt1'
    });

    let channel = pusher.subscribe('chat');
    channel.bind('message', function(data) {
      allMessages.push(data)
      setMessages(allMessages)
    });
  }, [])

  const submit = async e => {
    e.preventDefault()

    await fetch('http://localhost:8080/api/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        username,
        message,
      })
    })

    setMessage('')
  }


  return (
   <div className="container mt-5">
      <div className="d-flex flex-column align-items-stretch flex-shrink-0">
        <div className="d-flex align-items-center flex-shrink-0 p-3 link-body-emphasis text-decoration-none border-bottom">
          <input className="fs-5 fw-semibold" value={username} onChange={e => setUsername(e.target.value)}/>
        </div>
        <div className="list-group list-group-flush scrollarea">
          {messages.map(message => {
            return (
              <a href="#" className="list-group-item list-group-item-action active py-3 lh-sm" aria-current="true">
                <div className="d-flex w-100 align-items-center justify-content-between">
                  <strong className="mb-1">{message.username}</strong>
                  <small>Wed</small>
                </div>
                <div className="col-10 mb-1 small">{message.message}</div>
              </a>
            )
          })}
        </div>
      </div>
        <form className="mt-5" onSubmit={e => submit(e)}>
          <input className="form-control" value={message} onChange={e => setMessage(e.target.value)} />
        </form>
   </div>
  );
}

export default App;
