import React, { useState, useMemo, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
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
  existingAreaNames = [],
}) {
  // ----- PLUS -----
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [plusError, setPlusError] = useState(null);

  const handleOpen = () => {
    setPlusError(null);
    setOpen(true);
  };
  const handleClose = () => {
    if (!saving) setOpen(false);
  };

  const [formData, setFormData] = useState({
    areaName: "",
    areaDescription: "",
    imageUrl: "",
  });

  // image picker
  const [pickerOpen, setPickerOpen] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!pickerOpen) return;
    fetch("/pic_map/index.json")
      .then(r => r.json())
      .then(setImages)
      .catch(() => setImages([]));
  }, [pickerOpen]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isAreaNameUnique = useMemo(() => {
    const trimmedName = formData.areaName.trim();
    return !existingAreaNames.some(
      (name) => name.toLowerCase() === trimmedName.toLowerCase()
    );
  }, [formData.areaName, existingAreaNames]);

  const isValid = useMemo(
    () =>
      Object.values(formData).every(
        (v) => typeof v === "string" && v.trim() !== ""
      ) && isAreaNameUnique,
    [formData, isAreaNameUnique]
  );

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isValid || saving) return;

    try {
      setSaving(true);
      setPlusError(null);

      const payload = {
        area_name: formData.areaName.trim(),
        area_description: formData.areaDescription.trim(),
        img_path: formData.imageUrl.trim(),
      };

      await onCreate(payload);
      setFormData({ areaName: "", areaDescription: "", imageUrl: "" });
      setOpen(false);
    } catch (err) {
      console.error("Create area failed:", err);
      // Check for the "Conflict" message from the backend
      if (err.message && err.message.includes("Conflict")) {
        setPlusError("שם האזור כבר קיים. אנא בחר שם אחר.");
      } else {
        setPlusError(err.message || "Failed to create area.");
      }
    } finally {
      setSaving(false);
    }
  };

  // ----- MINUS -----
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [minusError, setMinusError] = useState(null);

  const openConfirm = () => {
    setMinusError(null);
    setConfirmOpen(true);
  };
  const closeConfirm = () => {
    if (!deleting) setConfirmOpen(false);
  };

  const areaLabel = deleteTargetArea?.area_name?.trim()
    ? `"${deleteTargetArea.area_name}"`
    : deleteTargetArea?.area_description?.trim()
      ? `"${deleteTargetArea.area_description}"`
      : deleteTargetId != null
        ? `Area #${deleteTargetId}`
        : "this area";

  const handleConfirmDelete = async () => {
    if (!deleteTargetId || deleting) return;
    try {
      setDeleting(true);
      setMinusError(null);
      await onDelete(deleteTargetId);
      setConfirmOpen(false);
    } catch (err) {
      console.error("Delete area failed:", err);
      setMinusError(err.message || "Failed to delete area.");
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
      {/* Buttons */}
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

        {/* Conditional message when no areas exist */}
        {!hasAreas && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              ml: 1,
            }}
          >
            <Typography
              variant="body1"
              sx={{ color: "text.secondary" }}
            ></Typography>
          </Box>
        )}

        {/* Minus Icon */}
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
            <h2
              style={{ color: "#111", margin: 0, marginBottom: 16 }}
              dir="rtl"
            >
              הוספת אזור חדש
            </h2>
            {plusError && (
              <p style={{ color: "crimson" }}>Error: {plusError}</p>
            )}
            <form onSubmit={handleSave} noValidate>
              <Stack direction="column" spacing={1.5}>
                <TextField
                  name="areaName"
                  label="שם אזור"
                  value={formData.areaName}
                  onChange={handleChange}
                  fullWidth
                  variant="standard"
                  required
                  disabled={saving}
                  inputProps={{ dir: "rtl" }}
                  InputLabelProps={{ sx: { left: "unset", right: 0 } }}
                  error={!isAreaNameUnique}
                  helperText={
                    !isAreaNameUnique ? "שם אזור זה כבר קיים" : ""
                  }
                />
                <TextField
                  name="areaDescription"
                  label="הוספת תיאור"
                  value={formData.areaDescription}
                  onChange={handleChange}
                  fullWidth
                  variant="standard"
                  multiline
                  required
                  disabled={saving}
                  inputProps={{ dir: "rtl" }}
                  InputLabelProps={{ sx: { left: "unset", right: 0 } }}
                />

                <TextField
                  name="imageUrl"
                  label="כתובת לתמונה"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  fullWidth
                  variant="standard"
                  required
                  disabled={saving}
                  InputLabelProps={{ sx: { left: "unset", right: 0 } }}
                />

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button 
                    id = "choose-existing-image-button"
                    type="button"
                    variant="outlined"
                    onClick={() => setPickerOpen(true)}
                    disabled={saving}
                    sx={{ textTransform: "none" }}
                  >
                    Choose from existing images
                  </Button>
                </div>

                <Stack direction="row" spacing={1.25} justifyContent="flex-end">
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
                        sx={{
                          textTransform: "none",
                          color: "white",
                          backgroundColor: "red",
                        }}
                      >
                        בטל
                      </Button>
                    </motion.div>
                  </motion.div>
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
                        sx={{
                          textTransform: "none",
                          color: "white",
                          backgroundColor: "green",
                        }}
                      >
                        {saving ? "שומר...." : "שמור"}
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
            <h2 style={{ marginTop: 0, color: "black" }} dir="rtl">
              מחיקת אזור
            </h2>
            {minusError && (
              <p style={{ color: "crimson" }}>Error: {minusError}</p>
            )}
            <p style={{ margin: "8px 0 16px", color: "black" }} dir="rtl">
              למחוק את אזור: <b>{areaLabel}</b> ?
            </p>

            <Stack direction="row" spacing={1.25} justifyContent="flex-end">
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
                    sx={{
                      textTransform: "none",
                      backgroundColor: "#666",
                      dir: "rtl",
                    }}
                  >
                    בטל
                  </Button>
                </motion.div>
              </motion.div>
              {/* Delete */}
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
                    sx={{
                      textTransform: "none",
                      backgroundColor: "red",
                      dir: "rtl",
                    }}
                  >
                    {deleting ? "מוחק..." : "מחק"}
                  </Button>
                </motion.div>
              </motion.div>
            </Stack>
          </div>
        </Fade>
      </Modal>

      {/* Image Picker Modal */}
      <Modal open={pickerOpen} onClose={() => setPickerOpen(false)}>
        <Fade in={pickerOpen} timeout={150}>
          <div
            style={{
              background: "#fff",
              padding: 20,
              margin: "10vh auto 0",
              width: 680,
              maxWidth: "92vw",
              borderRadius: 12,
              outline: "none",
              boxShadow: "0 8px 20px rgba(0,0,0,.12), 0 2px 6px rgba(0,0,0,.08)",
            }}
          >
            <h3 style={{ marginTop: 0 }} dir="rtl">בחר תמונה קיימת</h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                gap: 12,
                maxHeight: 420,
                overflowY: "auto",
              }}
            >
              {images.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, imageUrl: src }));
                    setPickerOpen(false);
                  }}
                  style={{
                    border: "1px solid #eee",
                    borderRadius: 8,
                    padding: 0,
                    cursor: "pointer",
                    background: "#fff",
                    textAlign: "center",
                  }}
                  title={src}
                >
                  <img
                    src={src}
                    alt=""
                    style={{
                      width: "100%",
                      height: 110,
                      objectFit: "cover",
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                    }}
                  />
                  <div
                    style={{
                      fontSize: 12,
                      padding: 6,
                      direction: "ltr",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {decodeURIComponent(src.split("/").pop())}
                  </div>
                </button>
              ))}
              {images.length === 0 && (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    color: "#666",
                  }}
                >
                  אין תמונות ב־/pic_map/index.json
                </div>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
              <Button onClick={() => setPickerOpen(false)} sx={{ textTransform: "none" }}>
                סגור
              </Button>
            </div>
          </div>
        </Fade>
      </Modal>

    </>
  );
}