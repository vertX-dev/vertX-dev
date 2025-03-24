import { world, system, Player } from "@minecraft/server";

system.runInterval(() => {
    const overworld = world.getDimension("overworld");
    const nether = world.getDimension("nether");
    const the_end = world.getDimension("the_end");

    let entities = overworld.getEntities({
        excludeFamilies: ['flag'],
        excludeTypes: ["sh:indique", "sh:fuel_machine", "player", "armor_stand", "pa:midasatacktexure"]
    });

    entities = entities.concat(nether.getEntities({
        excludeFamilies: ['flag'],
        excludeTypes: ["sh:indique", "sh:fuel_machine", "player", "armor_stand", "pa:midasatacktexure"]
    }));

    entities = entities.concat(the_end.getEntities({
        excludeFamilies: ['flag'],
        excludeTypes: ["sh:indique", "sh:fuel_machine", "player", "armor_stand", "pa:midasatacktexure"]
    }));

    for (const entity of entities) {
        const healthComponent = entity.getComponent("minecraft:health");
        const lines = entity.nameTag.split("\n");
        const exeName = lines[0];

        if (healthComponent) {
            const Vlhealth = healthComponent.currentValue;
            const MaxHealth = healthComponent.effectiveMax;
            const health = Math.floor(Vlhealth);

            if (health >= 7 && health <= 50000) {
                if (entity.typeId !== "minecraft:player") {
                    const entityId = entity.typeId;
                    const entityNameById = entityId.split(":")[1];
                    entity.nameTag = `[ ${entityNameById} ]\n§e${health}  / ${MaxHealth} Max`;
                } else {
                    if (exeName !== undefined) {
                        entity.nameTag = `[ ${exeName} ]\n§e${health} `;
                    } else {
                        entity.nameTag = `§e${health} `;
                    }
                }
            } else if (health >= 3 && health < 7) {
                if (entity.typeId !== "minecraft:player") {
                    const entityId = entity.typeId;
                    const entityNameById = entityId.split(":")[1];
                    entity.nameTag = `[ ${entityNameById} ]\n§a${health}  / ${MaxHealth} Max`;
                } else {
                    if (exeName !== undefined) {
                        entity.nameTag = `[ ${exeName} ]\n§a${health} `;
                    } else {
                        entity.nameTag = `§a${health} `;
                    }
                }
            } else if (health >= 0 && health < 3) {
                if (entity.typeId !== "minecraft:player") {
                    const entityId = entity.typeId;
                    const entityNameById = entityId.split(":")[1];
                    entity.nameTag = `[ ${entityNameById} ]\n§c${health}  / ${MaxHealth} Max`;
                } else {
                    if (exeName !== undefined) {
                        entity.nameTag = `[ ${exeName} ]\n§c${health} `;
                    } else {
                        entity.nameTag = `§c${health} `;
                    }
                }
            }
        }
    }
});