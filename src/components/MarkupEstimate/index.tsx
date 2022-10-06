import './style.sass';
import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { useMarkupStore } from 'hooks/useMarkupStore';

const MarkupEstimate: FC = observer(() => {
    const { estimate } = useMarkupStore();
    return (
        <div className="markup-estimate">
            <div className="markup-estimate__grade">
                Оценка: {estimate.grade}
            </div>
            <div className="markup-estimate__criterions">
                {Object.entries(estimate.criterions)?.map(([key, value]) => (
                    <div className="markup-estimate__criterion-item" key={key}>
                        {key}: {value}
                    </div>
                ))}
            </div>
        </div>
    );
});

export default MarkupEstimate;
