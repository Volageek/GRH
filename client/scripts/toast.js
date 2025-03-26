class Toast {
    static container = document.getElementById("toast-container");

    static show(message, type = "default", duration = 3000) {
        const toast = document.createElement("div");
        toast.classList.add("toast", type);

        const closeBtn = document.createElement("span");
        closeBtn.innerHTML = "&times;";
        closeBtn.classList.add("toast-close");
        closeBtn.onclick = () => this.remove(toast);

        toast.innerHTML = `${message} `;
        toast.appendChild(closeBtn);

        this.container.appendChild(toast);

        // Trigger reflow to enable transition
        toast.offsetHeight;
        toast.classList.add("show");

        if (duration > 0) {
            setTimeout(() => this.remove(toast), duration);
        }

        return toast;
    }

    static remove(toast) {
        toast.classList.remove("show");
        setTimeout(() => {
            toast.remove();
        }, 300);
    }

    static success(message, duration = 3000) {
        return this.show(message, "success", duration);
    }

    static error(message, duration = 3000) {
        return this.show(message, "error", duration);
    }

    static warning(message, duration = 3000) {
        return this.show(message, "warning", duration);
    }
}
