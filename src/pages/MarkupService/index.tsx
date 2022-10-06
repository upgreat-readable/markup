import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useMarkupStore } from 'hooks/useMarkupStore';
import cogoToast from 'cogo-toast';
import { MarkupData } from '../../types/markup';
import MarkupService from '../../components/MarkupService';
import './index.sass';
import Logo from 'assets/img/svg/service/logo-dark.svg';

const MarkupServicePage: FC = observer(() => {
    const { repository } = useMarkupStore();
    const [init, setInit] = useState<boolean>(false);
    const [fileContent, setFileContent] = useState<MarkupData>(null);

    const upload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files[0];
        const fileReader = new FileReader();
        fileReader.addEventListener('load', e => {
            try {
                setFileContent({ file: JSON.parse(e.target.result as string) });
            } catch (e) {
                cogoToast.error(`Ошибка чтения файла разметки: ${e.message}`);
                handleClose();
            }
        });
        fileReader.readAsText(file);
    };

    const handleClose = () => {
        setInit(false);
        setFileContent(null);
    };

    useEffect(() => {
        const initialize = async (task: MarkupData) => {
            try {
                await repository.initWithTask(task);
                setInit(true);
            } catch (e) {
                cogoToast.error(e.message || 'Ошибка разметки');
                handleClose();
            }
        };

        if (fileContent) {
            initialize(fileContent).catch(console.error);
        }
    }, [repository, fileContent]);

    if (init) {
        return <MarkupService handleClose={handleClose} />;
    }

    return (
        <div className="markup-service">
            <div className="markup-service__wrapper">
                <div className="markup-service__logo">
                    <img src={Logo} alt="" />
                </div>
                <div className="markup-service__button">
                    <label
                        htmlFor="file-upload"
                        className="markup-service__button-label button button--blue"
                    >
                        <span>Загрузить файл разметки</span>
                    </label>
                    <input
                        style={{ display: 'none' }}
                        id="file-upload"
                        type="file"
                        accept=".json, application/JSON"
                        onChange={upload}
                    />
                </div>
            </div>

            <div className="markup-service__link">
                <a
                    href="https://ai.upgreat.one/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    ai.upgreat.one
                </a>
            </div>
        </div>
    );
});
export default MarkupServicePage;
