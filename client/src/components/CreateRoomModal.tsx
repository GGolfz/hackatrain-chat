import axios from "axios";
import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import UserData from "../type/UserData";
import styles from "../styles/CreateRoomModal.module.css";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
interface Props {
  fetchRoomList: () => void;
  showModal: boolean;
  setShowModal: (d: boolean) => void;
}
const modalStyle = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    gap: "36px",
    padding: "24px",
    border: "none",
    borderRadius: "16px",
    width: "50vw",
  },
  overlay: {
    background: "rgba(33, 33, 33, 0.5)",
  },
};
const CreateRoomModal = ({ fetchRoomList, showModal, setShowModal }: Props) => {
  const [userList, setUserList] = useState<Array<UserData>>([]);
  const [roomName, setRoomName] = useState<string>("");
  const [roomMember, setRoomMember] = useState<Array<UserData>>([]);
  useEffect(() => {
    fetchUserList();
  }, []);

  const handleCreateRoom = () => {
    const token = localStorage.getItem("token");
    if (token != null) {
      axios
        .post(
          "http://localhost:3000/api/room",
          {
            name: roomName,
            members: roomMember.map((member) => member.id),
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        .then((res) => {
            fetchRoomList();
            setShowModal(false);
        });
    }
  };

  const fetchUserList = () => {
    const token = localStorage.getItem("token");
    if (token != null) {
      axios
        .get("http://localhost:3000/api/user/list", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          setUserList(res.data);
        });
    }
  };
  return (
    <ReactModal
      isOpen={showModal}
      onRequestClose={() => setShowModal(false)}
      style={modalStyle}
    >
      <div className={styles.roomModal}>
        <TextField
          label="Room Name"
          fullWidth
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        ></TextField>
        <Autocomplete
          multiple
          fullWidth
          id="tags-outlined"
          value={roomMember}
          onChange={(_, values) => setRoomMember(values)}
          options={userList}
          getOptionLabel={(option: UserData) => option.name}
          defaultValue={roomMember}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField {...params} label="To" fullWidth />
          )}
        />
        <Button onClick={handleCreateRoom}>Create</Button>
      </div>
    </ReactModal>
  );
};

export default CreateRoomModal;
