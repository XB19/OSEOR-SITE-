package tg.oseor.backend.mappers;

import org.mapstruct.Mapper;
import tg.oseor.backend.dtos.*;
import tg.oseor.backend.entities.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OseorMapper {
    ServiceDTO toServiceDTO(Service entity);
    Service toServiceEntity(ServiceDTO dto);
    List<ServiceDTO> toServiceDTOList(List<Service> entities);

    SecteurDTO toSecteurDTO(Secteur entity);
    Secteur toSecteurEntity(SecteurDTO dto);
    List<SecteurDTO> toSecteurDTOList(List<Secteur> entities);

    EntrepriseDTO toEntrepriseDTO(Entreprise entity);
    Entreprise toEntrepriseEntity(EntrepriseDTO dto);
    List<EntrepriseDTO> toEntrepriseDTOList(List<Entreprise> entities);

    @org.mapstruct.Mapping(source = "imageUrl", target = "image")
    ProjetDTO toProjetDTO(Projet entity);
    Projet toProjetEntity(ProjetDTO dto);
    List<ProjetDTO> toProjetDTOList(List<Projet> entities);

    StatDTO toStatDTO(Stat entity);
    Stat toStatEntity(StatDTO dto);
    List<StatDTO> toStatDTOList(List<Stat> entities);

    ContactDTO toContactDTO(Contact entity);
    Contact toContactEntity(ContactDTO dto);
    List<ContactDTO> toContactDTOList(List<Contact> entities);

    ActualiteDTO toActualiteDTO(Actualite entity);
    Actualite toActualiteEntity(ActualiteDTO dto);
    List<ActualiteDTO> toActualiteDTOList(List<Actualite> entities);

    OffreEmploiDTO toOffreEmploiDTO(OffreEmploi entity);
    OffreEmploi toOffreEmploiEntity(OffreEmploiDTO dto);
    List<OffreEmploiDTO> toOffreEmploiDTOList(List<OffreEmploi> entities);

    @org.mapstruct.Mapping(source = "offre.id", target = "offreId")
    CandidatureDTO toCandidatureDTO(Candidature entity);
    @org.mapstruct.Mapping(source = "offreId", target = "offre.id")
    Candidature toCandidatureEntity(CandidatureDTO dto);
    List<CandidatureDTO> toCandidatureDTOList(List<Candidature> entities);

    AppelOffreDTO toAppelOffreDTO(AppelOffre entity);
    AppelOffre toAppelOffreEntity(AppelOffreDTO dto);
    List<AppelOffreDTO> toAppelOffreDTOList(List<AppelOffre> entities);

    SiteContentDTO toSiteContentDTO(SiteContent entity);
    SiteContent toSiteContentEntity(SiteContentDTO dto);
    List<SiteContentDTO> toSiteContentDTOList(List<SiteContent> entities);
}
