import { InferGetServerSidePropsType } from "next";
import { GetServerSideProps } from "next";
import { Entity } from "service-manager/types/entity.type";
import { getEntities, getEntity } from "service-manager/types/network.type";
import { ServiceManager } from "../../../../lib/service-manager";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  TopBar,
  Header,
  RightPanel,
  EntityDetails,
  SearchInput,
  KeyValueList,
  Card,
  CardList,
  Table,
} from "@modularcloud/design-system";
import Image from "next/image";

import { CubesOff } from "@modularcloud/design-system";
import { SearchOptions } from "../../../../lib/search-options";

interface PanelProps {
  classes: string;
  type: string;
  id: string;
  metadata: { [key: string]: string };
}

const EntityPanel = ({ classes, type, id, metadata }: PanelProps) => (
  <RightPanel className={classes}>
    <EntityDetails iconType={<CubesOff />} type={type} hash={id} />
    <KeyValueList
      header="Block Information"
      entryLabels={Object.keys(metadata)}
      entries={Object.entries(metadata)}
    />
  </RightPanel>
);

export const getServerSideProps: GetServerSideProps<{
  entity: Entity;
  associated: Entity[];
}> = async ({ params }) => {
  const { networkLabel, entityType, field, fieldValue } = params ?? {};
  if (
    typeof networkLabel !== "string" ||
    typeof entityType !== "string" ||
    typeof field !== "string" ||
    typeof fieldValue !== "string"
  ) {
    throw Error(
      `Misconfigured parameters: network=${networkLabel}, entityType=${entityType}, field=${field}. fieldValue=${fieldValue}`
    );
  }

  const network = ServiceManager.getNetwork(networkLabel);
  if (!network) {
    return {
      notFound: true,
    };
  }

  const entity = await getEntity(network, entityType, field, fieldValue);
  if (!entity) {
    return {
      notFound: true,
    };
  }

  // temporary
  const associated: Entity[] = [];
  if (entityType.toLowerCase() === "block") {
    associated.push(
      ...(await getEntities(
        network,
        "transaction",
        "height",
        entity.metadata["Height"]
      ))
    );
  }

  if (entity.computed.Messages) {
    associated.push(...entity.computed.Messages);
  }

  return {
    props: {
      entity,
      associated,
    },
  };
};

function EntityPage({
  entity,
  associated,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [selectedItem, setSelectedItem] = useState(
    SearchOptions[0].options[0].value
  );

  const [openPopover, setOpenPopover] = useState(false);

  const [view, setView] = useState(
    entity.context.entityTypeName === "Transaction" || associated.length < 3
      ? "cards"
      : "table"
  );

  const handleSelect = (selectedItem: React.SetStateAction<string>) => {
    console.log(selectedItem);
    setSelectedItem(selectedItem);
  };

  const handleOpen = (openPopover: React.SetStateAction<boolean>) => {
    // set to true if no search results
    openPopover = false;
    setOpenPopover(openPopover);
  };

  return (
    <div className="flex">
      <div className="grow">
        <div className="lg:hidden">
          <TopBar
            type={entity.context.entityTypeName}
            id={entity.uniqueIdentifier}
          >
            <Image
              src="/images/Celestia-icon-logo.png"
              alt="Celestia"
              height="32"
              width="119"
            />
          </TopBar>
        </div>
        <Header
          searchInput={
            <SearchInput
              mode="light"
              placeholder="Go to hash or height"
              optionGroups={SearchOptions}
              selectedItem={selectedItem}
              selectHandler={handleSelect}
              isOpen={openPopover}
              handleOpen={handleOpen}
            />
          }
          panelContent={
            <EntityPanel
              classes="flex lg:hidden"
              type={entity.context.entityTypeName}
              id={entity.uniqueIdentifier}
              metadata={entity.metadata}
            />
          }
          onSwitchView={(view: string) => setView(view)}
          defaultView={view}
        />
        {view === "cards" ? (
          <CardList>
            {associated.map((entity) => (
              <Card
                key={entity.uniqueIdentifier}
                type={entity.context.entityTypeName}
                badgeText={entity.uniqueIdentifier}
                badgeIcon="reward"
              >
                <KeyValueList
                  entryLabels={Object.keys(entity.metadata)}
                  entries={Object.entries(entity.metadata)}
                />
              </Card>
            ))}
          </CardList>
        ) : null}
        {view === "table" ? (
          <Table data={associated} onRowClick={(row) => console.log(row)} />
        ) : null}
      </div>
      <EntityPanel
        classes="sticky top-0 hidden lg:flex"
        type={entity.context.entityTypeName}
        id={entity.uniqueIdentifier}
        metadata={entity.metadata}
      />
    </div>
  );
}

export default EntityPage;
