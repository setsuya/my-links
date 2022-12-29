import React, {
  useState,
  useEffect,
} from 'react';
import {
  Helmet,
  HelmetProvider,
} from 'react-helmet-async';

import Loader from './components/Loader';
import TitleSeparator from './components/TitleSeparator';
import NetworkItem from './components/NetworkItem';
import Credits from './components/Credits';

import defaultOptions from './utils/defaultOptions';
import translations from './utils/translations';

import {
  OptionsProps,
  NetworkProps,
  TranslationsProps,
} from './utils/types';

import {
  Container,
  Contents,
  User,
  Title,
  Bio,
  BioTitleTab,
  NetworksContainer,
  Networks,
} from './styles';

const App = () => {
  const [optionsData, setOptionsData] = useState<OptionsProps>(defaultOptions);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  useEffect(() => {
    fetch('options.json')
      .then((data) => data.json())
      .then((json) => {
        setOptionsData(json);

        setTimeout(() => setLoadingData(false), 1500);
      });
  }, []);

  return (
    <>
      {loadingData ? (
        <Loader />
      ) : (
        <HelmetProvider>
          <Container
            bgColor={optionsData.background.color}
            bgImage={optionsData.background.image}
          >
            <Helmet>
              <title>{translations[optionsData.user.language as keyof TranslationsProps].page_title(optionsData.user.name)}</title>
            </Helmet>
            <Contents>
              <User>
                <Title>
                  {translations[optionsData.user.language as keyof TranslationsProps].page_title(optionsData.user.name)}
                </Title>
                {optionsData.user.bio && (
                  <Bio>
                    <BioTitleTab>
                      {translations[optionsData.user.language as keyof TranslationsProps].about_me}
                    </BioTitleTab>
                    {optionsData.user.bio}
                  </Bio>
                )}
              </User>
              <Networks>
                {optionsData.groups.map((group: string, index: number) => {
                  return (
                    <NetworksContainer
                      key={`group_${index}`}
                    >
                      <TitleSeparator
                        title={group}
                      />
                      <Networks>
                        {optionsData.networks
                          .filter((item: NetworkProps) => item.group === group)
                          .map((network: NetworkProps, index: number) => {
                            return (
                              <NetworkItem
                                key={`network_${index}`}
                                name={network.name}
                                url={network.url}
                                icon={network.icon}
                                buttonColor={optionsData.buttons.color}
                                textColor={optionsData.buttons.text_color}
                                textHoverColor={optionsData.buttons.hover_color}
                              />
                            );
                          })
                        }
                      </Networks>
                    </NetworksContainer>
                  );
                })}
                {optionsData.networks.length !== 0 && (
                  <NetworksContainer>
                    {optionsData.groups.length !== 0 && (
                      <TitleSeparator
                        title={translations[optionsData.user.language as keyof TranslationsProps].other}
                      />
                    )}
                    <Networks>
                      {optionsData.networks
                        .filter((item: NetworkProps) => !item.group)
                        .map((network: NetworkProps, index: number) => {
                          return (
                            <NetworkItem
                              key={`network_${index}`}
                              name={network.name}
                              url={network.url}
                              icon={network.icon}
                              buttonColor={optionsData.buttons.color}
                              textColor={optionsData.buttons.text_color}
                              textHoverColor={optionsData.buttons.hover_color}
                            />
                          );
                        })
                      }
                    </Networks>
                  </NetworksContainer>
                )}
              </Networks>
            </Contents>
            <Credits
              language={optionsData.user.language}
            />
          </Container>
        </HelmetProvider>
      )}
    </>
  );
};

export default App;
