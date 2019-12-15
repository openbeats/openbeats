import { toast } from "react-toastify";

export function showMessage(message) {
    toast.dismiss();
    toast(message);
    return true;
}

export function featureNotify() {
    toast.dismiss();
    toast("We Appreciate Your Interest! This Feature is Under Development!");
    return true;
}