import styled from "styled-components";
import LogOut from "../features/authentication/LogOut";

const StyleHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);
`;

function Header() {
  return (
    <StyleHeader>
      <LogOut />
    </StyleHeader>
  );
}

export default Header;
