import React, { useState, useMemo } from "react";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { FaPlus, FaMinus } from "react-icons/fa";
import { motion } from "framer-motion";

const enterVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 6 },
  visible: { opacity: 1, scale: 1, y: 0 },
};
const interactVariants = {
  hover: { scale: 1.06, transition: { type: "spring", stiffness: 300 } },
  tap: { scale: 0.96 },
};

export default function AreasControlButtons({
  onCreate,
  onDelete,
  hasAreas = false,          
  deleteTargetId = null,     
  deleteTargetArea = null,   
}) {
  // ----- PLUS -----
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => { if (!saving) setOpen(false); };

  const [formData, setFormData] = useState({
    areaName: "",
    areaDescription: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValid = useMemo(
    () => Object.values(formData).every((v) => typeof v === "string" && v.trim() !== ""),
    [formData]
  );

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isValid || saving) return;

    try {
      setSaving(true);

      const payload = {
        area_name: formData.areaName.trim(),
        area_description: formData.areaDescription.trim(),
        img_path: formData.imageUrl.trim(),
      };

      const res = await fetch("/api/areas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`POST /api/areas failed: ${res.status} ${t}`);
      }

      const createdArea = await res.json();
      onCreate && onCreate(createdArea);

      setFormData({ areaName: "", areaDescription: "", imageUrl: "" });
      setOpen(false);
    } catch (err) {
      console.error("Create area failed:", err);
      alert("Failed to create area. See console for details.");
    } finally {
      setSaving(false);
    }
  };

  // ----- MINUS -----
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openConfirm = () => setConfirmOpen(true);
  const closeConfirm = () => { if (!deleting) setConfirmOpen(false); };

  const areaLabel =
    deleteTargetArea?.area_description?.trim()
      ? `"${deleteTargetArea.area_description}"`
      : (deleteTargetId != null ? `Area #${deleteTargetId}` : "this area");

  const handleConfirmDelete = async () => {
    if (!deleteTargetId || deleting) return;
    try {
      setDeleting(true);

      const res = await fetch(`/api/areas/${deleteTargetId}`, { method: "DELETE" });

      if (res.status === 409) {
        const t = await res.text().catch(() => "");
        alert(t || `Cannot delete ${areaLabel} because it has bins.`);
        return;
      }
      if (!res.ok && res.status !== 204) {
        const t = await res.text().catch(() => "");
        throw new Error(`DELETE /api/areas/${deleteTargetId} failed: ${res.status} ${t}`);
      }

      onDelete && onDelete(deleteTargetId);
      setConfirmOpen(false);
    } catch (err) {
      console.error("Delete area failed:", err);
      alert("Failed to delete area. See console for details.");
    } finally {
      setDeleting(false);
    }
  };

  const modalStyle = {
    background: "#fff",
    padding: 20,
    margin: "12vh auto 0",
    width: 420,
    maxWidth: "92vw",
    borderRadius: 12,
    outline: "none",
    boxShadow: "0 8px 20px rgba(0,0,0,.12), 0 2px 6px rgba(0,0,0,.08)",
  };

  return (
    <>
      {/*Buttons*/}
      <Stack direction="row" spacing={1}>
        {/* PLUS */}
        <IconButton
          sx={{ color: "green" }}
          aria-label="Add a New Area"
          onClick={handleOpen}
          size="large"
        >
          <FaPlus size={22} />
        </IconButton>

        {/* Disabeld Minus Icon */}
        <IconButton
          sx={{ color: "red" }}
          aria-label="Delete Latest Area"
          onClick={openConfirm}
          size="large"
          disabled={!hasAreas || deleting}
        >
          <FaMinus size={22} />
        </IconButton>
      </Stack>

      {/* Adding Modal */}
      <Modal open={open} onClose={handleClose}>
        <Fade in={open} timeout={200}>
          <div style={modalStyle}>
            <h2 style={{ color: "#111", margin: 0, marginBottom: 16 }}>
              Add a New Area
            </h2>

            <form onSubmit={handleSave} noValidate>
              <Stack direction="column" spacing={1.5}>
                <TextField
                  name="areaName"
                  label="Area Name"
                  value={formData.areaName}
                  onChange={handleChange}
                  fullWidth
                  autoFocus
                  required
                  disabled={saving}
                />

                <TextField
                  name="areaDescription"
                  label="Area Description"
                  value={formData.areaDescription}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={3}
                  required
                  disabled={saving}
                />

                <TextField
                  name="imageUrl"
                  label="Image URL"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  fullWidth
                  required
                  disabled={saving}
                />

                <Stack direction="row" spacing={1.25} justifyContent="flex-end">
                  {/* Save */}
                  <motion.div
                    variants={enterVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.25 }}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <motion.div variants={interactVariants}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={!isValid || saving}
                        sx={{ textTransform: "none", color: "white", backgroundColor: "green" }}
                      >
                        {saving ? "Saving..." : "Save"}
                      </Button>
                    </motion.div>
                  </motion.div>

                  {/* Cancel */}
                  <motion.div
                    variants={enterVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.25, delay: 0.05 }}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <motion.div variants={interactVariants}>
                      <Button
                        type="button"
                        variant="contained"
                        onClick={handleClose}
                        disabled={saving}
                        sx={{ textTransform: "none", color: "white", backgroundColor: "red" }}
                      >
                        Cancel
                      </Button>
                    </motion.div>
                  </motion.div>
                </Stack>
              </Stack>
            </form>
          </div>
        </Fade>
      </Modal>

      {/* Deleting Modal */}
      <Modal open={confirmOpen} onClose={closeConfirm}>
        <Fade in={confirmOpen} timeout={150}>
          <div style={modalStyle}>
            <h2 style={{ marginTop: 0, color: "black" }}>Delete area?</h2>
            <p style={{ margin: "8px 0 16px", color: "black" }}>
              Are you sure you want to delete area : <b>{areaLabel}</b> ?
            </p>

            <Stack direction="row" spacing={1.25} justifyContent="flex-end">
              {/* Delete (עם אותם אפקטים כמו בפלוס) */}
              <motion.div
                variants={enterVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.25 }}
                whileHover="hover"
                whileTap="tap"
              >
                <motion.div variants={interactVariants}>
                  <Button
                    type="button"
                    variant="contained"
                    onClick={handleConfirmDelete}
                    disabled={!hasAreas || deleting}
                    sx={{ textTransform: "none", backgroundColor: "red" }}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </Button>
                </motion.div>
              </motion.div>

              {/* Cancel */}
              <motion.div
                variants={enterVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.25, delay: 0.05 }}
                whileHover="hover"
                whileTap="tap"
              >
                <motion.div variants={interactVariants}>
                  <Button
                    type="button"
                    variant="contained"
                    onClick={closeConfirm}
                    disabled={deleting}
                    sx={{ textTransform: "none", backgroundColor: "#666" }}
                  >
                    Cancel
                  </Button>
                </motion.div>
              </motion.div>
            </Stack>
          </div>
        </Fade>
      </Modal>
    </>
  );
}
