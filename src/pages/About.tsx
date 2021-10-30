import React, { Fragment } from 'react'
import { Trans } from 'react-i18next'
import { useHistory } from 'react-router-dom'

export const About: React.FC = () => {
  const history = useHistory()

  return (
    <Fragment>
      <h1>
        <Trans i18nKey="about.title">About</Trans>
      </h1>
      <p>
        <Trans i18nKey="about.description">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas
          possimus doloribus error cumque autem asperiores, ullam deserunt
          quidem omnis doloremque itaque eius eaque sint facilis unde tenetur
          reiciendis aliquam soluta?
        </Trans>
      </p>
      <button
        type="button"
        className="btn"
        cy-data="go-back-button"
        onClick={() => history.push('/')}
      >
        <Trans i18nKey="buttons.goBack">Go back</Trans>
      </button>
    </Fragment>
  )
}
