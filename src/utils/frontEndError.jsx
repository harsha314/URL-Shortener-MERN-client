function getById(id) {
    return document.getElementById(id);
}

class frontEndError extends Error {
    constructor(msg, cause, type = 'danger') {
        super(msg);
        // console.log(msg, cause, type);
        this.cause = cause;
        this.type = type;
        this.userError(cause, type);
    }
    userError(cause, type = 'danger') {
        try {
            getById(cause + '-help').textContent =
                this.message || 'Dont know the error';
            getById(cause).classList.add('border-' + type);
            getById(cause + '-help').classList.remove('opacity-0');
            getById(cause + '-help').classList.add('opacity-1');
            setTimeout(() => {
                if (!getById(`${cause}`)) return;
                if (!getById(`${cause}-help`).classList.contains('opacity-0'))
                    getById(`${cause}-help`).classList.add('opacity-0');
                if (getById(`${cause}-help`).classList.contains('opacity-1'))
                    getById(`${cause}-help`).classList.remove('opacity-1');
            }, 5000);
            function eventHandler(e) {
                getById(cause + '-help').textContent = ' \0';
                e.target.classList.remove('border-' + type);
                getById(cause + '-help').classList.add('opacity-0');
                getById(cause + '-help').classList.remove('opacity-1');

                e.target.removeEventListener('click', eventHandler);
            }
            getById(cause).addEventListener('click', eventHandler);
        } catch (e) {
            this.devError(e);
        }
    }
    devError(e) {
        console.log('dev Error');
        console.log(e.message);
    }
}

export default frontEndError;
