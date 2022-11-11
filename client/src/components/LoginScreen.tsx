import { Button, TextField } from "@mui/material";
import { useState } from "react";

interface Props {
  handleLogin: (name: string) => void;
}
const LoginScreen = ({ handleLogin }: Props) => {
  const [name, setName] = useState("");
  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <div>
        <div style={{ marginBottom: "1rem" }}>
          Welcome, Please provide your name here!
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <TextField
            placeholder="Name"
            value={name}
            size="small"
            onChange={(e) => setName(e.target.value)}
          />
          <Button variant="outlined" onClick={() => handleLogin(name)}>
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
