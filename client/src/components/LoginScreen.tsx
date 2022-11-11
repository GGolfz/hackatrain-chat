import { useState } from "react";

interface Props {
  handleLogin: (name: string) => void;
}
const LoginScreen = ({ handleLogin }: Props) => {
  const [name, setName] = useState("");
  return (
    <div>
      <div>Welcome, Please provide your name here!</div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <button onClick={() => handleLogin(name)}>Create Account</button>
    </div>
  );
};

export default LoginScreen;
