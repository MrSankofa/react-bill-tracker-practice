
1. using state for form data
2. how to two way bind form data object to html
3. method for getting form data
4. onchange syntax and method
5. validation for form
6. writing test for these features
7. creating an emptyBill object
8. how to tie bill id to isEditing logic for updating a bill
9. forgot the event type for the event
10. syntax for form submit for handleSubmit
11. input placeholder trick
12. adding a key when using a map in your jsx
13. how you should update the form when click edit, updating state
14. How to use the new redux slices


Answers

1. using state for form data

const [formData, setFormData] = useState<Omit<Bill, "id" | "userId">>( emptyBill);

2. how to two way bind form data object to html

```jsx
    <input type="text" value={formData.name}
           placeholder={"e.g. DTE"}
           name={"name"} />
```

3. method for getting form data (form data only has a partial of the required bill interface type)

```ts
const getFormData = (): Bill => {
    const bill: Bill = {
        id: editBillId || Date.now().toString(),
        userId: "1",
        name: formData.name,
        amount: formData.amount,
        dueDate: formData.dueDate,
        category: formData.category,
        account: formData.account,
    };

    return bill;
}
```

4. onchange syntax and method

```ts
const handleInputChange = (field: string, data: string | number) => {
    setFormData(prevState => ({...prevState, [field]: data}) );

    // validation
  }
```

```jsx
<input type="text" value={formData.name}
       placeholder={"e.g. DTE"}
       name={"name"}
       onChange={ (e) => handleInputChange("name", e.target.value)}
/>
```

5. validation for form

```ts
// form validation approach

const [errors, setErrors ] = useState<Record<string, string>>({})


const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if(!formData.name.trim()) {
        newErrors.name = 'Bill Name is required';
    }

    if(!formData.category.trim()) {
        newErrors.category = 'Category is required';
    }

    if(!formData.account.trim()) {
        newErrors.source = 'source is required';
    }

    if(formData.amount <= 0) {
        newErrors.amount = 'Amount must be greater than 0';
    }

    if(formData.dueDate < 1 || formData.dueDate > 31) {
        newErrors.dueDate = 'Due date must be between 1 and 31';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
}

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if( !validateForm()) return;

    const id: string = editBillId || Date.now().toString();

    const newBill: Bill = getFormData(id);

    if(isEditing) {
        setBills(prevState => prevState.map( bill => {
            if( bill.id === editBillId) {
                return newBill;
            }

            return bill;
        }))
    } else {
        setBills( prevState => [...prevState, newBill]);
    }

    setFormData(emptyBill);
    setEditBillId(null);
};

// field validation approach

const validateField = (field: string, value: string | number): string => {
    switch (field) {
        case "name":
            return value.toString().trim() === "" ? "Bill Name is required" : "";
        case "category":
            return value.toString().trim() === "" ? "Category is required" : "";
        case "source":
            return value.toString().trim() === "" ? "Source is required" : "";
        case "amount":
            return typeof value === "number" && value <= 0 ? "Amount must be greater than 0" : "";
        case "dueDate":
            return typeof value === "number" && (value < 1 || value > 31) ? "Due date must be between 1 and 31" : "";
        default:
            return "";
    }

const handleInputChange = (field: string, value: string | number) => {
    // Update the form state
    setFormData(prev => ({ ...prev, [field]: value }));

    // Validate the field directly
    const error = validateField(field, value);

    // Update that field's error only
    setErrors(prev => ({ ...prev, [field]: error }));
};
```

6. writing test for these features

7. creating an emptyBill object

```ts
const emptyBill: Omit<Bill, "id" | "userId"> = {
    name: "",
    amount: 0,
    dueDate: 1,
    category: "",
    account: "",
}
```

8. how to tie bill id to isEditing logic for updating a bill

```ts
const [editBillId, setBillId] = useState<string | null>( null );

const isEditingBill = editBillId !== null ;

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newBill = getFormData();

    if(!isEditingBill) {
        setBills(prevState => [...prevState, newBill])
    } else {
        setBills( prevState => prevState.map( bill => {
            if(bill.id === editBillId) {
                return newBill;
            }
            return bill
        }))
    }

    setFormData(() => ({...emptyBill}));
    setBillId(null); // Forget to reset form
}

```

9. forgot the event type for the event

```ts
    (e: React.FormEvent) => {};
```

10. syntax for form submit for handleSubmit

```html
    <form action="#" onSubmit={handleSubmit}></form>
```


11. input placeholder trick

```jsx
 <input value={formData.dueDate || ''}  />
```


12. adding a key when using a map in your jsx

```jsx
<tbody>
{
  bills.map( bill => {

    // forgot to add a key
    return (
      <tr key={bill.id}>
        <td>{bill.name}</td>
        <td>{bill.amount}</td>
        <td>{bill.dueDate}</td>
        <td>{bill.category}</td>
        <td>{bill.account}</td>
        <td>
          <button onClick={() => startEditing(bill)}>Edit</button>
          <button onClick={() => deleteBill(bill)}>delete</button>
        </td>
      </tr>
    );
  })
}

</tbody>
```

13. how you should update the form when click edit, updating state

```jsx
const startEditing = (targetBill: Bill) => {
  setBillId(targetBill.id);
  setFormData(targetBill);
}
```

14. How to use the new redux slices

```ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Type Definitions
export type Bill = {
  id: string;
  name: string;
  amount: number;
  dueDate: number;
  category: string;
  source: string;
  userId: string;
  isPaid: boolean;
};

type BillState = Bill[];

const initialState: BillState = [];

// Slice Definition
const billSlice = createSlice({
  name: "bills",
  initialState,
  reducers: {
    addBill: (state, action: PayloadAction<Bill>) => {
      state.push(action.payload);
    },
    updateBill: (state, action: PayloadAction<Bill>) => {
      const index = state.findIndex(bill => bill.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteBill: (state, action: PayloadAction<string>) => {
      return state.filter(bill => bill.id !== action.payload);
    }
  }
});

// Export actions and reducer
export const { addBill, updateBill, deleteBill } = billSlice.actions;
export default billSlice.reducer;

// used in a component

import { useDispatch } from "react-redux";
import { addBill, updateBill, deleteBill, Bill } from "../slices/billSlice";

const dispatch = useDispatch();

// Add
dispatch(addBill(newBill));

// Update
dispatch(updateBill(updatedBill));

// Delete
dispatch(deleteBill(billId));


```
