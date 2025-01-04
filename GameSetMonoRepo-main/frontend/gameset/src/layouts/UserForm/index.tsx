// import "@aws-amplify/ui-react";
// import { Authenticator, Button, Input } from "@aws-amplify/ui-react";
// import { useAppSelector } from "../../hooks/hooks";
// import React, { useState, useEffect } from 'react';

// export const UserForm = () => {
//   const loaded = useAppSelector((state) => state.auth.loaded);
//   const username = useAppSelector((state) => state.auth.userName);
//   const email = useAppSelector((state) => state.auth.email);
//   const userId = useAppSelector((state) => state.auth.userID);

//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     zipcode: ''
//   });

//   useEffect(() => {
//     if (loaded) {
//       setFormData({
//         ...formData,
//         username: username || '',
//         email: email || ''
//       });
//     }
//   }, [loaded, username, email]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     try {
//       const response = await fetch('https://api.gameset.link/User/CreateUser', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           // Include other headers as required by the API
//         },
//         body: JSON.stringify({
//           userID: userId, // You'll need to replace these values with actual data
//           userName: formData.username,
//           imageURL: "string", // Replace with actual data if available
//           firstName: "string", // Replace with actual data
//           lastName: "string", // Replace with actual data
//           phoneNumber: "string", // Replace with actual data
//           email: formData.email,
//           birthdate: "2024-01-31T03:04:54.597Z", // Replace with actual data
//           zipcode: formData.zipcode,
//           gender: "string" // Replace with actual data
//         })
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       // Handle success response
//     } catch (error) {
//       // Handle errors here
//     }
//   };

//   if (!loaded) {
//     return <div>Loading...</div>; // Loading state
//   }

//   return (
//     <Authenticator>
//       {({ signOut, user }) => (
//         <main>
//           <h1>Hello {user?.username}</h1>
//           <Button onClick={signOut}>Sign Out</Button>
//           <h1>This is the user attributes form</h1>
//           <form onSubmit={handleSubmit}>
//             <div>
//               <Input
//                 name="username"
//                 value={formData.username}
//                 onChange={handleInputChange}
//                 readOnly
//                 id="username"
//                 placeholder="Username"
//               />
//             </div>
//             <div>
//               <Input
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 id="email"
//                 placeholder="Email"
//               />
//             </div>
//             <div>
//               <Input
//                 name="zipcode"
//                 value={formData.zipcode}
//                 onChange={handleInputChange}
//                 id="zipcode"
//                 placeholder="Zipcode"
//               />
//             </div>
//             <Button type="submit">Submit</Button>
//           </form>
//         </main>
//       )}
//     </Authenticator>
//   );
// };
