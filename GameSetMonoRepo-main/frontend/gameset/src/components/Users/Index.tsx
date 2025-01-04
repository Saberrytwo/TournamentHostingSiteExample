import { useEffect, useState } from "react";
import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";
import { toast } from "react-toastify";

async function currentSession() {
  try {
    const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
    return { accessToken, idToken };
  } catch (err) {
    toast.error("Something went wrong", {
      position: "top-right",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }
}

interface UserData {
  firstName: string;
  // Add other properties as needed
}

export const UserList = () => {
  const [userData, setUserData] = useState<UserData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionInfo = await currentSession();

        // Check if the idToken is available before accessing it
        if (sessionInfo?.idToken) {
          const headers = {
            Authorization: `Bearer ${sessionInfo?.idToken.toString()}`,
          };
          const response = await axios.get("https://localhost:7068/User/GetUsers", {
            headers: headers,
          });

          setUserData(response.data);
        } else {
          toast.error("Error configuring your log in, log out and try again.", {
            position: "top-right",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
      } catch (error) {
        toast.error("Error occurred on log in", {
          position: "top-right",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        // Handle error accordingly, e.g., redirect to login
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {userData.map((user, index) => (
          <li key={index}>{user.firstName}</li>
        ))}
      </ul>
    </div>
  );
};
