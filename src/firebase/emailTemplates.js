export const TokenConfirmation = (token) => `
  <centered>
    <p style='margin-bottom: 20px'>The below is your confirmation token for Grant Tracker web application. </p>
    <h1 style='text-align:center'>${token}</h1>
  </centered>
`

export const ExistingUserGrantInv = ({ grantName, piName, link }) => `
  <centered>
    <p>This is to inform you that you have been invited as a co-researcher to <strong>${grantName}</strong> grant by <strong>${piName}</strong> at <strong>Universiti Sains Malaysia</strong>. <a href=${link}>Log in</a> to your account if you have not already to access the grant dashboard.</p>
  </centered>
`

export const NonExistingUserGrantInv = ({ grantName, piName, link }) => `
  <centered>
    <p>This is to inform you that you have been invited as a co-researcher for <strong>${grantName}</strong> grant by <strong>${piName}</strong> at <strong>Universiti Sains Malaysia</strong>. Follow the link below to activate your account and access the dashboard.</p>
    <div style="margin-top: 20px;">
      <a href=${link}>${link}</a>
    </div>
  </centered>
`
