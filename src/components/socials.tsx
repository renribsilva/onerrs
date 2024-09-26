import styles from "../styles/socials.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMastodon, faGithub, faBluesky } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

const SocialObjects = [
  {
    ícone: faMastodon, // Adicione a referência ao ícone aqui
    alt: 'ícone do mastodon',
    link: 'https://ursal.zone/@renribsilva',
  },
  {
    ícone: faBluesky, // Adicione a referência ao ícone aqui
    alt: 'ícone do bluesky',
    link: 'https://bsky.app/profile/renribsilva.ursal.zone.ap.brid.gy',
  },
  {
    ícone: faGithub, // Adicione a referência ao ícone aqui
    alt: 'ícone do github',
    link: 'https://github.com/renribsilva',
  },
];

export default function Socials () {
  return (
    <ul className={styles.ul}>
      {SocialObjects.map(({ ícone, link, alt }) => {
        return (
          <li key={link}>
            <Link target="_blank" href={link} aria-label={alt}>
              <FontAwesomeIcon icon={ícone} size="lg" />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}