import React, { useState } from 'react';
import styled from 'styled-components';

import {
  GenericModal,
  Icon,
  Text,
  Button,
  Switch,
  ModalFooterConfirmation
} from '../../../index';

const SearchInput = styled.input`
  border: none;
  background-color: transparent;
  box-shadow: none;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  width: 250px;

  :focus {
    outline: none;
  }
`;

const BodyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid ${({ theme }) => theme.colors.separator};
  padding: 0 10px;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  height: 52px;
  border-right: 2px solid ${({ theme }) => theme.colors.separator};
  padding: 0 10px;
`;

const StyledItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 24px;
  height: 51px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.separator};

  :last-child {
    border-bottom: 0px;
  }
`;

const StyledImage = styled.img`
  width: 26px;
  height: 26px;
  object-fit: contain;
  margin: 0 16px 0 0;
`;

const StyledImageName = styled.div`
  display: flex;
  align-items: center;
`;

const FormContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 24px;
`;

const TextDesc = styled(Text)`
  width: 350px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

type Props = {
  title?: string;
  defaultIconUrl: string;
  itemList: Array<{
    id: number | string;
    iconUrl: string;
    name: string;
    description?: string;
    checked: boolean;
  }>;
  addButtonLabel?: string;
  formBody: React.ReactNode;
  isSubmitFormDisabled?: boolean;
  onSubmitForm: () => void;
  onItemToggle: (itemId: number | string, checked: boolean) => void;
  onClose: () => void;
};

const ManageList = ({
  title = 'Manage List',
  itemList,
  defaultIconUrl,
  formBody,
  addButtonLabel = 'add',
  isSubmitFormDisabled = false,
  onSubmitForm,
  onItemToggle,
  onClose
}: Props): JSX.Element => {
  const [search, setSearch] = useState('');
  const [isFormMode, setIsFormMode] = useState(false);

  const setDefaultImage = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    (e.target as HTMLImageElement).onerror = null;
    (e.target as HTMLImageElement).src = defaultIconUrl;
  };

  const getFilteredItemList = () => {
    if (!search || !search.length) {
      return itemList;
    }

    return itemList.filter(
      (i) =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.description?.toLowerCase().includes(search.toLowerCase())
    );
  };

  const getBody = () => {
    return isFormMode ? (
      <FormContainer>{formBody}</FormContainer>
    ) : (
      <>
        <BodyHeader>
          <SearchContainer>
            <Icon size="md" type="search" />
            <SearchInput
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search"
              value={search}
            />
          </SearchContainer>
          <Button
            size="md"
            color="primary"
            variant="contained"
            onClick={() => setIsFormMode(!isFormMode)}>
            <Text size="lg" color="white">
              + {addButtonLabel}
            </Text>
          </Button>
        </BodyHeader>
        <div>
          {getFilteredItemList().map((i) => {
            const onChange = (checked: boolean) => onItemToggle(i.id, checked);

            return (
              <StyledItem key={i.id}>
                <StyledImageName>
                  <StyledImage
                    alt={i.name}
                    onError={setDefaultImage}
                    src={i.iconUrl}
                  />
                  <div>
                    <div>
                      <Text size="lg" strong>
                        {i.name}
                      </Text>
                    </div>
                    <div>
                      <TextDesc size="md">
                        {i.description && i.description}
                      </TextDesc>
                    </div>
                  </div>
                </StyledImageName>
                <Switch checked={i.checked} onChange={onChange} />
              </StyledItem>
            );
          })}
        </div>
      </>
    );
  };

  const getFooter = () => {
    return !isFormMode ? null : (
      <ModalFooterConfirmation
        okText="Save"
        okDisabled={isSubmitFormDisabled}
        handleCancel={() => setIsFormMode(false)}
        handleOk={onSubmitForm}
      />
    );
  };

  return (
    <GenericModal
      onClose={onClose}
      title={title}
      body={getBody()}
      footer={getFooter()}
      withoutBodyPadding
    />
  );
};

export default ManageList;
