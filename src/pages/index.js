import React from 'react';
import PropTypes from 'prop-types';
import { Link, graphql } from 'gatsby';
import styled from 'styled-components';
import { Layout, Article, Wrapper, Button, SectionTitle, ProjectCard } from 'components';
import { media } from '../utils/media';

const Content = styled.div`
  grid-column: 2;
  box-shadow: 0 4px 120px rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  padding: 3rem 6rem;
  @media ${media.tablet} {
    padding: 3rem 2rem;
  }
  @media ${media.phone} {
    padding: 2rem 1.5rem;
  }
  overflow: hidden;
`;

const Hero = styled.div`
  grid-column: 2;
  padding: 3rem 2rem 6rem 2rem;
  text-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  color: ${props => props.theme.colors.grey.dark};
  p {
    font-size: 1.68rem;
    margin-top: -1rem;
    @media ${media.phone} {
      font-size: 1.25rem;
    }
    @media ${media.tablet} {
      font-size: 1.45rem;
    }
  }
`;

const ProjectsWrapper = styled.div`
  grid-column: 2;
  justify-content: space-between;
  margin-bottom: 2rem;
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: repeat(2, 1fr);
  @media (max-width: 1200px) {
    grid-gap: 3rem;
  }
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-gap: 2rem;
  }
`;

const IndexPage = ({
  data: {
    allMarkdownRemark: { edges: postEdges },
  },
}) => (
  <Layout>
    <Wrapper>
      <Hero>
        <h1>Hi.</h1>
        <p>
          I&apos;m <b>Lucas Melin</b>, a Computer Engineering Technology - Computing Science student at Algonquin
          College, and a Quality Assurance Analyst at the Bank of Canada.
        </p>
        <Link to="/contact">
          <Button big>
            <svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
              <path d="M1764 11q33 24 27 64l-256 1536q-5 29-32 45-14 8-31 8-11 0-24-5l-453-185-242 295q-18 23-49 23-13 0-22-4-19-7-30.5-23.5t-11.5-36.5v-349l864-1059-1069 925-395-162q-37-14-40-55-2-40 32-59l1664-960q15-9 32-9 20 0 36 11z" />
            </svg>
            Contact
          </Button>
        </Link>
      </Hero>
      <ProjectsWrapper>
        <ProjectCard
          title="Ant Facts"
          link="https://www.amazon.com/dp/B079X4T9WV/"
          bg="linear-gradient(to right, #D4145A 0%, #FBB03B 100%)"
        >
          An Amazon Alexa voice skill built using AWS Lambda and NodeJS
        </ProjectCard>
        <ProjectCard
          title="Droppod"
          link="https://github.com/lucasmelin/droppod"
          bg="linear-gradient(to right, #009245 0%, #FCEE21 100%)"
        >
          A JavaEE Social Podcasting Application
        </ProjectCard>
        <ProjectCard
          title="CHIP-8"
          link="https://github.com/lucasmelin/kotlin-chip-8"
          bg="linear-gradient(to right, #00242b 0%, #7de38d 100%)"
        >
          A CHIP-8 interpreter written in Kotlin.
        </ProjectCard>
        <ProjectCard
          title="ACCK"
          link="https://github.com/lucasmelin/AndroidCurrencyConvertert"
          bg="linear-gradient(to right, #fe5938 0%, #b07219 100%)"
        >
          Kotlin Android app featuring daily conversion rate updates.
        </ProjectCard>
      </ProjectsWrapper>
      <Content>
        <SectionTitle>Latest stories</SectionTitle>
        {postEdges.map(post => (
          <Article
            title={post.node.frontmatter.title}
            date={post.node.frontmatter.date}
            excerpt={post.node.excerpt}
            timeToRead={post.node.timeToRead}
            slug={post.node.fields.slug}
            category={post.node.frontmatter.category}
            key={post.node.fields.slug}
          />
        ))}
      </Content>
    </Wrapper>
  </Layout>
);

export default IndexPage;

IndexPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array.isRequired,
    }),
  }).isRequired,
};

export const IndexQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "DD.MM.YYYY")
            category
          }
          excerpt(pruneLength: 200)
          timeToRead
        }
      }
    }
  }
`;
