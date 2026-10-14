
/**
 * Copyright (C) 2021 Thomas Weber
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import './import-first';

import React, {useEffect} from 'react';

import Interface from './render-interface.jsx';
import render from './app-target';

import {initializeGoIcon} from '../lib/go-icon';
import {
    initializeCustomDefaultProject
} from '../lib/customDefaultProject';

const PlayerOnlyInterface = props => {
    useEffect(() => {
        const cleanupGoIcon = initializeGoIcon();

        initializeCustomDefaultProject();

        // Restore the previous non-fullscreen URL when fullscreen exits.
        const previousUrl =
            sessionStorage.getItem('scratch-previous-mode-url') || '/';

        const handleFullscreenChange = () => {
            const store = window.ReduxStore;
            if (!store) return;

            const mode = store.getState().scratchGui.mode;
            if (!mode || mode.isFullScreen) return;

            const targetUrl = previousUrl === '/editor'
                ? '/editor'
                : '/';

            if (window.location.pathname !== targetUrl) {
                window.history.replaceState(
                    window.history.state,
                    '',
                    targetUrl
                );
            }
        };

        const store = window.ReduxStore;
        const unsubscribe = store
            ? store.subscribe(handleFullscreenChange)
            : null;

        return () => {
            cleanupGoIcon();
            if (unsubscribe) unsubscribe();
        };
    }, []);

    return <Interface {...props} />;
};

render(
    <PlayerOnlyInterface
        isPlayerOnly
        isFullScreen
    />
);
