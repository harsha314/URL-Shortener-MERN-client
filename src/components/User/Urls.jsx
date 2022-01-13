import { useState, useRef } from 'react';
import axios from 'axios';
import Url from './Url';
import { API_URL } from '../../env';
import frontEndError from '../../utils/frontEndError';
import LoadingButton from '../../utils/LoadingButton';

const Urls = ({ urls, setUrls }) => {
    const [loading, setLoading] = useState('');

    const longUrlRef = useRef();
    const shortUrlRef = useRef();

    const createUrl = async (e) => {
        e.preventDefault();
        setLoading('new-createUrl');

        const userToken = localStorage.getItem('userToken');

        const authToken = localStorage.getItem('authToken');
        const longUrl = longUrlRef.current.value;
        const shortUrl = shortUrlRef.current.value;

        // console.log(longUrl, shortUrl);

        try {
            if (!longUrl)
                throw new frontEndError(
                    'Long URL cant be empty',
                    'new-longUrl'
                );
            const res = await axios.post(
                `${API_URL}/url?user=${userToken}`,
                { longUrl, requestedShortUrl: shortUrl },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );

            setUrls([...urls, res.data]);
            longUrlRef.current.value = '';
            shortUrlRef.current.value = '';

            setLoading('');
        } catch (e) {
            const { response: res } = e;
            // console.log('createUrl', res, e.message);
            if (res.status === 405)
                new frontEndError(res.data.error, `new-${res.data.cause}`);
            setLoading('');
        }
    };
    return (
        <div
            className="row justify-content-center justify-content-lg-start"
            style={{ maxWidth: '95vw' }}
        >
            <div
                className="card m-2"
                style={{
                    width: '24rem'
                }}
            >
                <div className="card-body">
                    <div className="mb-1">
                        <div
                            className="input-group"
                            aria-describedby="new-longUrl-help"
                        >
                            <input
                                ref={longUrlRef}
                                type="text"
                                className="form-control"
                                id="new-longUrl"
                                placeholder="Long URL"
                            />
                        </div>
                        <div
                            className="form-text text-center opacity-0"
                            id="new-longUrl-help"
                        >
                            {' \0'}
                        </div>
                    </div>
                    <div className="mb-2">
                        <div
                            className="input-group input-group-sm"
                            id="new-shortUrl"
                            aria-describedby="new-shortUrl-help"
                        >
                            <input
                                ref={shortUrlRef}
                                type="text"
                                className="form-control"
                                id="new-shortUrl"
                                placeholder="Short URL"
                            />
                        </div>
                        <div
                            className="form-text text-center opacity-0"
                            id="new-shortUrl-help"
                        >
                            {' \0'}
                        </div>
                    </div>
                    <div className="d-flex justify-content-evenly">
                        <div className="flex-grow-0">
                            <LoadingButton
                                loading={loading}
                                id="new-createUrl"
                                value="Create"
                                onClick={createUrl}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {urls.map((url) => (
                <Url url={url} urls={urls} key={url._id} setUrls={setUrls} />
            ))}
        </div>
    );
};

export default Urls;
