import { useState, useRef } from 'react';
import axios from 'axios';

import LoadingButton from '../../utils/LoadingButton';

import Clipboard from 'clipboard';

import { API_URL, REDIRECT_URL } from '../../env';

import frontEndError from '../../utils/frontEndError';
import RevertBackButton from '../../utils/RevertBackButton';

function getById(id) {
    return document.getElementById(id);
}

const Url = ({ urls, setUrls, url }) => {
    // stores the id of button clicked
    // disabled all inputs and load the clicked
    const [loading, setLoading] = useState('');

    // empty if all requests made by component are successful
    // id of the failed request button if any request made by component are failed
    // add a revert back button to correct long or short url
    const [failed, setFailed] = useState('');

    const [longUrl, setLongUrl] = useState(url.longUrl);
    const [shortUrl, setShortUrl] = useState(url.shortUrl);

    const longUrlRef = useRef();
    const shortUrlRef = useRef();
    const prevLongUrl = useRef(url.longUrl);
    const prevShortUrl = useRef(url.shortUrl);

    const onLongUrl = (e) => {
        setLongUrl(e.target.value);
    };
    const onShortUrl = (e) => {
        setShortUrl(e.target.value);
    };

    const updateUrl = async (e) => {
        e.preventDefault();
        const authToken = localStorage.getItem('authToken');
        const userToken = localStorage.getItem('userToken');
        setLoading(e.target.id);

        try {
            if (
                prevLongUrl.current === longUrl &&
                prevShortUrl.current === shortUrl
            )
                throw new Error('No Change');

            await axios.put(
                `${API_URL}/url/${url._id}?user=${userToken}`,
                { longUrl, requestedShortUrl: shortUrl },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            prevLongUrl.current = longUrl;
            prevShortUrl.current = shortUrl;
            new frontEndError('Saved Successfully', `shortUrl${url._id}`, '');
            setLoading('');
        } catch (e) {
            console.log('updateUrl', e.message);
            const { response: res } = e;
            if (res.status === 405)
                new frontEndError(
                    res.data.error,
                    `${res.data.cause}${url._id}`
                );

            setLoading('');
        }
    };
    const deleteUrl = async (e) => {
        e.preventDefault();
        setLoading(e.target.id);
        const authToken = localStorage.getItem('authToken');
        const userToken = localStorage.getItem('userToken');
        try {
            await axios.delete(`${API_URL}/url/${url._id}?user=${userToken}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setLoading('');
            setUrls(urls.filter(({ _id }) => _id !== url._id));
        } catch (e) {
            const { response: res } = e;
            console.log('deleteUrl', res, e.message);
            if (res.status === 405)
                new frontEndError(
                    res.data.error,
                    `${res.data.cause}${url._id}`
                );
            setLoading('');
        }
    };

    const toggleUrl = (e) => {
        let x = e.target;

        x.textContent = x.textContent === 'URL' ? REDIRECT_URL : 'URL';
    };

    const toLastCorrect = (e) => {
        console.log('toLastCorrect', prevLongUrl.current, prevShortUrl.current);
        setLongUrl(prevLongUrl.current);
        setShortUrl(prevShortUrl.current);
        longUrlRef.current.value = prevLongUrl.current;
        shortUrlRef.current.value = prevShortUrl.current;
        getById(failed).focus();
        setFailed('');
    };

    const copyToClipboard = (e) => {
        e.preventDefault();
        new Clipboard(`#${e.target.id}`, {
            text: function () {
                var a = document.querySelector(`#shortUrl${url._id}`).value;
                return `${REDIRECT_URL}/${a}`;
            }
        });
        e.target.value = '✅';
        setTimeout(() => {
            e.target.value = '✍️'; // '📋';
        }, 1000);
    };

    return (
        <div className="card m-2" style={{ width: '24rem' }}>
            <div className="card-body">
                <div className="mb-1">
                    <div
                        className="input-group"
                        aria-describedby={url._id + 'longUrl-help'}
                    >
                        <input
                            ref={longUrlRef}
                            type="text"
                            className="form-control"
                            id={`longUrl${url._id}`}
                            defaultValue={url.longUrl}
                            onChange={onLongUrl}
                            readOnly={loading}
                        />
                    </div>
                    <div
                        className="form-text text-center"
                        id={`longUrl${url._id}-help`}
                    >
                        {' \0'}
                    </div>
                </div>

                <div className="mb-2">
                    <div
                        className="input-group input-group-sm"
                        aria-describedby={`shortUrl${url._id}-help`}
                    >
                        {/* <input
                            type="text"
                            className="input-group-text"
                            id={`redirect-url${url._id}`}
                            value={'URL'}
                            // value={REDIRECT_URL}
                            onClick={toggleUrl}
                            readOnly
                        /> */}
                        <span
                            className="input-group-text btn btn-secondary"
                            id={`redirect-url${url._id}`}
                            onClick={toggleUrl}
                            title="Click to show full URL"
                        >
                            {'URL'}
                        </span>

                        <input
                            ref={shortUrlRef}
                            type="text"
                            className="form-control"
                            id={`shortUrl${url._id}`}
                            defaultValue={url.shortUrl}
                            onChange={onShortUrl}
                            readOnly={loading}
                        />
                        <input
                            type="button"
                            className="input-group-text"
                            id={`copy${url._id}`}
                            defaultValue={'✍️'}
                            onClick={copyToClipboard}
                            disabled={loading}
                            data-clipboard-action="copy"
                            title="Copy to Clipboard"
                        />
                    </div>
                    <div
                        className="form-text text-center opacity"
                        id={`shortUrl${url._id}-help`}
                    >
                        {' \0'}
                    </div>
                </div>
                <div className="d-flex justify-content-evenly">
                    <div className="flex-grow-0">
                        {failed ? (
                            <RevertBackButton onClick={toLastCorrect} />
                        ) : (
                            ''
                        )}
                    </div>
                    <div className="flex-grow-0">
                        <LoadingButton
                            id={`${url._id}-updateUrl`}
                            loading={loading}
                            value="Update"
                            onClick={updateUrl}
                            disabled={
                                loading ||
                                (longUrl === prevLongUrl.current &&
                                    shortUrl === prevShortUrl.current)
                            }
                        />
                    </div>
                    <div className="flex-grow-0">
                        <LoadingButton
                            id={`${url._id}-deleteUrl`}
                            loading={loading}
                            value="Delete"
                            onClick={deleteUrl}
                            cssType="danger"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Url;
