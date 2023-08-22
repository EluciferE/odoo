/* @odoo-module */

import { patchUiSize, SIZES } from "@mail/../tests/helpers/patch_ui_size";
import { click, contains, start, startServer } from "@mail/../tests/helpers/test_utils";

QUnit.module("mobile messaging menu (patch)", {
    beforeEach() {
        patchUiSize({ size: SIZES.SM });
    },
});

QUnit.test("Livechat button is not present when there is no livechat thread", async () => {
    await start();
    await click(".o_menu_systray i[aria-label='Messages']");
    await contains(".o-mail-MessagingMenu");
    await contains(".o-mail-MessagingMenu-navbar:contains(Livechat)", 0);
});

QUnit.test("Livechat button is present when there is at least one livechat thread", async () => {
    const pyEnv = await startServer();
    pyEnv["discuss.channel"].create({
        anonymous_name: "Visitor 11",
        channel_member_ids: [
            [0, 0, { partner_id: pyEnv.currentPartnerId }],
            [0, 0, { partner_id: pyEnv.publicPartnerId }],
        ],
        channel_type: "livechat",
        livechat_operator_id: pyEnv.currentPartnerId,
    });
    await start();
    await click(".o_menu_systray i[aria-label='Messages']");
    await contains(".o-mail-MessagingMenu");
    await contains(".o-mail-MessagingMenu-navbar:contains(Livechat)");
});
