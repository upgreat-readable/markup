import React from 'react';
import { IMarkupDependencies } from 'domain/markup/entities/service/service.interface';
import { MarkupService } from 'domain/markup/entities/service/service.entity';
import { MarkupRenderer } from 'domain/markup/entities/renderer/renderer.entity';
import { MarkupMenu } from 'domain/markup/entities/menu/menu.entity';
import { FragmentConnection } from 'domain/markup/entities/connector/connector.entity';
import { NestingChecker } from 'domain/markup/entities/nesting/nesting.entity';
import { Badges } from 'domain/markup/entities/badges/badge.entity';
import { MarkupEstimate } from 'domain/markup/entities/estimates/estimates.entity';
import { MarkupRepository } from '../../domain/markup/entities/repository/repository';

const dependencies: IMarkupDependencies = {
    repository: MarkupRepository,
    renderer: MarkupRenderer,
    connector: FragmentConnection,
    badges: Badges,
    menu: MarkupMenu,
    nestingChecker: NestingChecker,
    estimate: MarkupEstimate,
};

const markupService = new MarkupService(dependencies);

export const markupStoresContext = React.createContext({
    markUp: markupService,
    repository: markupService.repository,
    menu: markupService.menu,
    badges: markupService.badges,
    estimate: markupService.estimate,
});
