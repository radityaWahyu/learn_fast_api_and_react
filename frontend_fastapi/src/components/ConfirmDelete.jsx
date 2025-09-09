import Divider from '@mui/joy/Divider';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import Button from "@mui/joy/Button";

export default function ConfirmDelete({open=false,loading=false, onDelete, onClose}){
    return (
        <Modal open={open} onClose={onClose}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <WarningRoundedIcon />
            Konfirmasi Hapus
          </DialogTitle>
          <Divider />
          <DialogContent>
            Apakah anda ingin menghapus data ini ?
          </DialogContent>
          <DialogActions>
            <Button variant="solid" color="danger" onClick={onDelete} loading={loading}>
              Hapus data
            </Button>
            <Button variant="plain" color="neutral" onClick={onClose} loading={loading}>
              Batalkan
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    )
}