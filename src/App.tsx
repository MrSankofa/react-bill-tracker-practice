
import './App.css'

function App() {


  return (
    <>
      <h1>Bill Tracker app</h1>

      <h3>Bill Form</h3>

        <form className="form">
            <div className="form-row">
                <label htmlFor="name">Name</label>
                <input id="name" type="text" placeholder="e.g. DTE"/>
            </div>
            <div className="form-row">
                <label htmlFor="amount">Amount</label>
                <input id="amount" type="number" placeholder="0.00"/>
            </div>
            <div className="form-row">
                <label htmlFor="dueDate">Due Date</label>
                <input id="dueDate" type="number" placeholder="7"/>
            </div>
            <div className="form-row">
                <label htmlFor="category">Category</label>
                <input id="category" type="text" placeholder="e.g. Fixed Monthly Bills"/>
            </div>
            <div className="form-row">
                <label htmlFor="account">Account</label>
                <input id="account" type="text" placeholder="e.g. Chase"/>
            </div>
        </form>
        <h3>Bill List</h3>
    </>
  )
}

export default App
