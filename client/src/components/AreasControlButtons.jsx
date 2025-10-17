import React, { useState, useMemo, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
<<<<<<< HEAD
=======
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
>>>>>>> 3047e0688a457157a29eac394b451d96f2f6918f
import { FaPlus, FaMinus } from "react-icons/fa";
import { SlPencil } from "react-icons/sl";
import { motion } from "framer-motion";
import { SlSizeFullscreen } from "react-icons/sl";
<<<<<<< HEAD
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
=======
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
>>>>>>> 3047e0688a457157a29eac394b451d96f2f6918f

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
  onEdit,
  hasAreas = false,
  deleteTargetId = null,
  deleteTargetArea = null,
  existingAreaNames = [],
  onSizeChange,
<<<<<<< HEAD
=======

>>>>>>> 3047e0688a457157a29eac394b451d96f2f6918f
}) {
  // EDIT
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState(null);
  const [formData, setFormData] = useState({
    areaName: "",
    areaDescription: "",
    imageUrl: "",
  });

  const handleEditOpen = () => {
    if (!deleteTargetArea) return;
    setEditError(null);
    setFormData({
      areaName: deleteTargetArea.area_name || "",
      areaDescription: deleteTargetArea.area_description || "",
      imageUrl: deleteTargetArea.img_path || "",
    });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    if (!editing) setEditOpen(false);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!deleteTargetId || editing || !isEditValid) return;

    try {
      setEditing(true);
      setEditError(null);

      const payload = {
        area_name: formData.areaName.trim(),
        area_description: formData.areaDescription.trim(),
        img_path: formData.imageUrl.trim(),
      };

      await onEdit(deleteTargetId, payload);
      setEditOpen(false);
    } catch (err) {
      console.error("Edit area failed:", err);
      setEditError("Failed to edit area. See console for details.");
    } finally {
      setEditing(false);
    }
  };

  const isAreaNameUnique = useMemo(() => {
    const trimmedName = formData.areaName.trim();
    return !existingAreaNames.some(
      (name) => name.toLowerCase() === trimmedName.toLowerCase()
    );
  }, [formData.areaName, existingAreaNames]);

  const isEditNameUnique = useMemo(() => {
    const trimmedName = formData.areaName.trim();
<<<<<<< HEAD
    const otherAreaNames = existingAreaNames.filter(
      (name) => name !== deleteTargetArea?.area_name
    );
=======
    const otherAreaNames = existingAreaNames.filter(name => name !== deleteTargetArea?.area_name);
>>>>>>> 3047e0688a457157a29eac394b451d96f2f6918f
    return !otherAreaNames.some(
      (name) => name.toLowerCase() === trimmedName.toLowerCase()
    );
  }, [formData.areaName, existingAreaNames, deleteTargetArea]);

  const isAddValid = useMemo(
    () =>
      Object.values(formData).every(
        (v) => typeof v === "string" && v.trim() !== ""
      ) && isAreaNameUnique,
    [formData, isAreaNameUnique]
  );
<<<<<<< HEAD

=======
  
>>>>>>> 3047e0688a457157a29eac394b451d96f2f6918f
  const isEditValid = useMemo(
    () =>
      Object.values(formData).every(
        (v) => typeof v === "string" && v.trim() !== ""
      ) && isEditNameUnique,
    [formData, isEditNameUnique]
  );

  // PLUS
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [plusError, setPlusError] = useState(null);

  const handleOpen = () => {
    setPlusError(null);
    setFormData({
      areaName: "",
      areaDescription: "",
      imageUrl: "",
    });
    setOpen(true);
  };
<<<<<<< HEAD

=======
  
>>>>>>> 3047e0688a457157a29eac394b451d96f2f6918f
  const handleClose = () => {
    if (!saving) setOpen(false);
  };

  // image picker
  const [pickerOpen, setPickerOpen] = useState(false);
  const [images, setImages] = useState([]);
<<<<<<< HEAD
  const [clearing, setClearing] = useState(false);

  // טען רשימת תמונות פעם אחת
  useEffect(() => {
    fetch("http://localhost:3000/api/images/list")
      .then((r) => r.json())
      .then((arr) => setImages(Array.isArray(arr) ? arr : []))
      .catch(() => setImages([]));
  }, []);

  // רענון הרשימה בכל פתיחה של המודאל (אופציונלי אך שימושי)
  useEffect(() => {
    if (!pickerOpen) return;
    fetch("http://localhost:3000/api/images/list")
      .then((r) => r.json())
      .then((arr) => setImages(Array.isArray(arr) ? arr : []))
=======

  useEffect(() => {
    if (!pickerOpen) return;
    fetch("/pic_map/index.json")
      .then((r) => r.json())
      .then(setImages)
>>>>>>> 3047e0688a457157a29eac394b451d96f2f6918f
      .catch(() => setImages([]));
  }, [pickerOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append("image", file);

    try {
      const res = await fetch("http://localhost:3000/api/images/upload", {
        method: "POST",
        body: formDataUpload,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

<<<<<<< HEAD
      const fullUrl = data.fullUrl
        ? data.fullUrl
        : `http://localhost:3000${data.imageUrl}`;

      setFormData((prev) => ({ ...prev, imageUrl: fullUrl }));

      // הוסף מיד למודאל
      setImages((prev) => {
        const next = new Set(prev);
        next.add(fullUrl);
        return Array.from(next);
      });
=======
      setFormData((prev) => ({
        ...prev,
        imageUrl: `http://localhost:3000${data.imageUrl}`,
      }));

      setImages((prev) => [...prev, data.imageUrl]);
>>>>>>> 3047e0688a457157a29eac394b451d96f2f6918f
    } catch (err) {
      console.error("Upload failed:", err);
      setPlusError("Upload failed");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isAddValid || saving) return;

    try {
      setSaving(true);
      setPlusError(null);

      const payload = {
        area_name: formData.areaName.trim(),
        area_description: formData.areaDescription.trim(),
        img_path: formData.imageUrl.trim(),
      };

      await onCreate(payload);

      setImages((prev) => {
<<<<<<< HEAD
        const url = formData.imageUrl.trim();
        if (!prev.includes(url)) return [...prev, url];
=======
        if (!prev.includes(formData.imageUrl.trim())) {
          return [...prev, formData.imageUrl.trim()];
        }
>>>>>>> 3047e0688a457157a29eac394b451d96f2f6918f
        return prev;
      });

      setFormData({ areaName: "", areaDescription: "", imageUrl: "" });
      setOpen(false);
    } catch (err) {
      console.error("Create area failed:", err);
      if (err.message && err.message.includes("Conflict")) {
        setPlusError("Area name already exists. Please choose another.");
      } else {
        setPlusError(err.message || "Failed to create area.");
      }
    } finally {
      setSaving(false);
    }
  };

  // MINUS
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [minusError, setMinusError] = useState(null);

  const openConfirm = () => {
    setMinusError(null);
    setConfirmOpen(true);
  };
<<<<<<< HEAD

=======
  
>>>>>>> 3047e0688a457157a29eac394b451d96f2f6918f
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

  // BinSize
  const [binSize, setBinSize] = useState("Medium");
  const [sizeModalOpen, setSizeModalOpen] = useState(false);

  const handleSizeOpen = () => setSizeModalOpen(true);
  const handleSizeClose = () => setSizeModalOpen(false);

  const handleSizeChange = (event, newValue) => {
    setBinSize(newValue);
  };

  const handleSizeSave = () => {
<<<<<<< HEAD
    onSizeChange?.(binSize);
    setSizeModalOpen(false);
  };

  const handleClearAllImages = async () => {
    if (clearing) return;
    const ok = window.confirm("Are you sure you want to delete ALL images?");
    if (!ok) return;

    try {
      setClearing(true);
      const res = await fetch("http://localhost:3000/api/images/clear", {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to clear images");
      }
      setImages([]); 
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to clear images");
    } finally {
      setClearing(false);
    }
=======
    if (onSizeChange) {
      onSizeChange(binSize);   
    }
    setSizeModalOpen(false);
>>>>>>> 3047e0688a457157a29eac394b451d96f2f6918f
  };

  return (
    <>
      {/* Buttons */}
      <Stack direction="row" spacing={1}>
        {/* Delete */}
        <IconButton
          sx={{ color: "#FF4F0F" }}
          aria-label="Delete Area"
          onClick={openConfirm}
          size="large"
          disabled={!hasAreas || deleting}
        >
          <FaMinus size={22} />
        </IconButton>

        {/* Add */}
        <IconButton
          sx={{ color: "#03A6A1" }}
          aria-label="Add a New Area"
          onClick={handleOpen}
          size="large"
        >
          <FaPlus size={22} />
        </IconButton>

        {/* Edit */}
        <IconButton
          sx={{ color: "orange" }}
          aria-label="Edit Area"
          onClick={handleEditOpen}
          size="large"
          disabled={!hasAreas}
        >
          <SlPencil size={22} />
        </IconButton>

        {/* BinSize*/}
        <IconButton
          sx={{ color: "#FF4F0F" }}
          aria-label="Bin Size"
          onClick={handleSizeOpen}
          size="large"
        >
          <SlSizeFullscreen size={22} />
        </IconButton>
      </Stack>

      {/* Add Modal */}
      <Modal open={open} onClose={handleClose}>
        <Fade in={open} timeout={200}>
          <div style={modalStyle}>
<<<<<<< HEAD
            <h2 style={{ color: "#111", margin: 0, marginBottom: 16, fontFamily: "Fira Sans" }}>
              Add New Area
            </h2>
            {plusError && (
              <p style={{ color: "crimson", fontFamily: "Fira Sans" }}>
                Error: {plusError}
              </p>
            )}
=======
            <h2 style={{ color: "#111", margin: 0, marginBottom: 16 , fontFamily: "Fira Sans"}}>Add New Area</h2>
            {plusError && <p style={{ color: "crimson" , fontFamily: "Fira Sans" }}>Error: {plusError}</p>}
>>>>>>> 3047e0688a457157a29eac394b451d96f2f6918f
            <form onSubmit={handleSave} noValidate>
              <Stack direction="column" spacing={1.5}>
                <TextField
                  name="areaName"
                  label="Area Name"
                  value={formData.areaName}
                  onChange={handleChange}
                  fullWidth
                  required
                  disabled={saving}
                  error={!isAreaNameUnique}
                  helperText={!isAreaNameUnique ? "Area name already exists" : ""}
                />
                <TextField
                  name="areaDescription"
                  label="Area Description"
                  value={formData.areaDescription}
                  onChange={handleChange}
                  fullWidth
                  multiline
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

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
<<<<<<< HEAD
                  <Button variant="outlined" component="label" sx={{ textTransform: "none" }}>
=======
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{ textTransform: "none" }}
                  >
>>>>>>> 3047e0688a457157a29eac394b451d96f2f6918f
                    Upload from computer
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.length > 0) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                    />
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => setPickerOpen(true)}
                    disabled={saving}
                    sx={{ textTransform: "none" }}
                  >
                    Choose from existing images
                  </Button>
                </div>

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
                        disabled={!isAddValid || saving}
                        sx={{
                          textTransform: "none",
                          color: "white",
                          backgroundColor: "green",
                        }}
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
                        sx={{
                          textTransform: "none",
                          backgroundColor: "#666",
                        }}
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

      {/* Delete Modal */}
      <Modal open={confirmOpen} onClose={closeConfirm}>
        <Fade in={confirmOpen} timeout={150}>
          <div style={modalStyle}>
<<<<<<< HEAD
            <h2 style={{ marginTop: 0, color: "black", fontFamily: "Fira Sans" }}>
              Delete Area
            </h2>
            {minusError && <p style={{ color: "crimson" }}>Error: {minusError}</p>}
            <p style={{ margin: "8px 0 16px", color: "black", fontFamily: "Fira Sans" }}>
=======
            <h2 style={{ marginTop: 0, color: "black" , fontFamily: "Fira Sans" }}>Delete Area</h2>
            {minusError && <p style={{ color: "crimson" }}>Error: {minusError}</p>}
            <p style={{ margin: "8px 0 16px", color: "black" , fontFamily: "Fira Sans" }}>
>>>>>>> 3047e0688a457157a29eac394b451d96f2f6918f
              Are you sure you want to delete the area : <b>{areaLabel}</b> ?
            </p>

            <Stack direction="row" spacing={1.25} justifyContent="flex-end">
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
                    }}
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
                    sx={{
                      textTransform: "none",
                      backgroundColor: "#666",
                    }}
                  >
                    Cancel
                  </Button>
                </motion.div>
              </motion.div>
            </Stack>
          </div>
        </Fade>
      </Modal>

      {/* Edit Modal */}
      <Modal open={editOpen} onClose={handleEditClose}>
        <Fade in={editOpen} timeout={200}>
          <div style={modalStyle}>
<<<<<<< HEAD
            <h2 style={{ color: "#111", margin: 0, marginBottom: 16, fontFamily: "Fira Sans" }}>
              Edit Area
            </h2>
=======
            <h2 style={{ color: "#111", margin: 0, marginBottom: 16 , fontFamily: "Fira Sans" }}>Edit Area</h2>
>>>>>>> 3047e0688a457157a29eac394b451d96f2f6918f
            {editError && <p style={{ color: "crimson" }}>Error: {editError}</p>}

            <form onSubmit={handleEditSave} noValidate>
              <Stack direction="column" spacing={1.5}>
                <TextField
                  name="areaName"
                  label="Area Name"
                  value={formData.areaName}
                  onChange={handleChange}
                  fullWidth
                  required
                  disabled={editing}
                  error={!isEditNameUnique}
                  helperText={!isEditNameUnique ? "Area name already exists" : ""}
                />
                <TextField
                  name="areaDescription"
                  label="Area Description"
                  value={formData.areaDescription}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  required
                  disabled={editing}
                />
                <TextField
                  name="imageUrl"
                  label="Image URL"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  fullWidth
                  required
                  disabled={editing}
                />

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <Button variant="outlined" component="label" sx={{ textTransform: "none" }}>
                    Upload from computer
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.length > 0) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                    />
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => setPickerOpen(true)}
                    disabled={editing}
                    sx={{ textTransform: "none" }}
                  >
                    Choose from existing images
                  </Button>
                </div>

                <Stack direction="row" spacing={1.25} justifyContent="flex-end">
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
                        type="submit"
                        variant="contained"
                        disabled={editing || !isEditValid}
                        sx={{
                          textTransform: "none",
                          color: "white",
                          backgroundColor: "orange",
                        }}
                      >
                        {editing ? "Updating..." : "Update"}
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
                        onClick={handleEditClose}
                        disabled={editing}
                        sx={{
                          textTransform: "none",
                          backgroundColor: "#666",
                        }}
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
<<<<<<< HEAD
            <h2 style={{ marginTop: 0, color: "black ", fontFamily: "Fira Sans" }}>
              Choose Existing Image
            </h2>
=======
            <h2 style={{ marginTop: 0, color: "black " , fontFamily: "Fira Sans"}}>Choose Existing Image</h2>
>>>>>>> 3047e0688a457157a29eac394b451d96f2f6918f

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
<<<<<<< HEAD
                  No images found
=======
                  No images found in /pic_map/index.json
>>>>>>> 3047e0688a457157a29eac394b451d96f2f6918f
                </div>
              )}
            </div>

<<<<<<< HEAD
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 12,
                gap: 8,
              }}
            >
              <Button
                onClick={handleClearAllImages}
                disabled={clearing}
                color="error"
                variant="outlined"
                sx={{ textTransform: "none" ,border: "none" }}
                title="Delete all images from server"
              >
                {clearing ? "Clearing..." : "Clear"}
              </Button>

=======
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
>>>>>>> 3047e0688a457157a29eac394b451d96f2f6918f
              <Button onClick={() => setPickerOpen(false)} sx={{ textTransform: "none" }}>
                Close
              </Button>
            </div>
          </div>
        </Fade>
      </Modal>
<<<<<<< HEAD

      {/* Bin size Modal */}
      <Modal open={sizeModalOpen} onClose={handleSizeClose}>
        <Fade in={sizeModalOpen} timeout={200}>
          <div
            style={{
              background: "#fff",
              padding: 20,
              margin: "12vh auto 0",
              width: 320,
              borderRadius: 12,
              outline: "none",
              boxShadow: "0 8px 20px rgba(0,0,0,.12), 0 2px 6px rgba(0,0,0,.08)",
            }}
          >
            <h2 style={{ marginTop: 0, color: "black", fontFamily: "Fira Sans" }}>
              Choose Bin Size
            </h2>
=======
      
      {/* Bin size Modal */}
      <Modal open={sizeModalOpen} onClose={handleSizeClose}>
        <Fade in={sizeModalOpen} timeout={200}>
          <div style={{
            background: "#fff",
            padding: 20,
            margin: "12vh auto 0",
            width: 320,
            borderRadius: 12,
            outline: "none",
            boxShadow: "0 8px 20px rgba(0,0,0,.12), 0 2px 6px rgba(0,0,0,.08)",
          }}>
            <h2 style={{ marginTop: 0, color: "black", fontFamily: "Fira Sans"}}>Choose Bin Size</h2>
>>>>>>> 3047e0688a457157a29eac394b451d96f2f6918f
            <Stack direction="column" spacing={3}>
              <Select
                defaultValue="Medium"
                value={binSize}
                onChange={handleSizeChange}
                slotProps={{ listbox: { sx: { zIndex: 1500 } } }}
              >
                <Option value="Small">Small</Option>
                <Option value="Medium">Medium</Option>
                <Option value="Big">Big</Option>
              </Select>

              <Stack direction="row" spacing={2} justifyContent="center">
                {/* Save */}
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
                      onClick={handleSizeSave}
                      sx={{ backgroundColor: "orange", color: "white", textTransform: "none" }}
                    >
                      Save
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Cancel */}
                <motion.div
                  variants={enterVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.25, delay: 0.1 }}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <motion.div variants={interactVariants}>
                    <Button
                      type="button"
                      variant="contained"
                      onClick={handleSizeClose}
                      sx={{ backgroundColor: "#666", color: "white", textTransform: "none" }}
                    >
                      Cancel
                    </Button>
                  </motion.div>
                </motion.div>
              </Stack>
            </Stack>
          </div>
        </Fade>
      </Modal>
    </>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 3047e0688a457157a29eac394b451d96f2f6918f
