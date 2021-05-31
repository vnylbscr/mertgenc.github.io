import React, { useEffect, useState } from 'react'
import { Container, Spinner, Col, Image, Row } from 'react-bootstrap';
import { useParams } from "react-router-dom"
import styled from 'styled-components';
import sanityClient from "../sanity-client/client";
import BlockContent from "@sanity/block-content-to-react";
import { serializers } from "../serializer/serializer";
import imageUrlBuilder from "@sanity/image-url"
import dayjs from "dayjs";
import tr from "dayjs/locale/tr";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.locale(tr);
dayjs.extend(relativeTime);
const PostTitle = styled.h1`
    font-family:'KoHo';
    font-size: 50px;
    color: rgb(73, 194, 216);
    text-align:center;
    margin-left: 10px;
`;

const UserTitle = styled(PostTitle)`
    font-size:20px;
    font-family:"Roboto Mono";
    text-align:left;
`

const DateTitle = styled(UserTitle)`
    color:#beb7b7;
    font-weight:bold;
`

const ReadTimeTitle = styled(DateTitle)`
    font-size:20px;
`
const builder = imageUrlBuilder(sanityClient);
function urlFor(source) {
    return builder.image(source);
}
export const Post = () => {
    const [postData, setPostData] = useState(null);
    const { slug } = useParams();
    useEffect(() => {
        sanityClient
            .fetch(
                `*[slug.current == $slug]{
          title,
          slug,
          mainImage{
            asset->{
              _id,
              url
             }
           },
         body,
        "name": author->name,
        "authorImage": author->image,
        publishedAt,
        _createdAt
       }`,
                { slug }
            )
            .then((data) => {
                setPostData(data[0]);
                console.log(data[0]);
            })
            .catch(console.error);
    }, [slug]);
    if (!postData) {
        return <Spinner animation="border" size="sm"></Spinner>
    }
    return (
        <Container fluid className="bg-dark d-flex justify-content-center align-items-center" >
            <Container className="bg-transparent mt-5 pl-2">
                <Col className="blog-content bg-transparent">
                    <PostTitle>
                        {postData.title.toUpperCase()}
                    </PostTitle>
                    <Row className="d-flex justify-content-between align-items-center">
                        <Col className="d-flex justify-content-start align-items-center ml-2 my-5">
                            <Image
                                className="rounded-circle img-fluid"
                                src={urlFor(postData.authorImage).width(60).height(60).url()}
                                alt={postData.name} />
                            <Col>
                                <UserTitle>
                                    {postData.name}
                                </UserTitle>
                                <UserTitle><a className="twitter-username" href="http://twitter.com/accurcy">@accurcy</a></UserTitle>
                            </Col>
                            <Col className="ml-5 date-title">
                                <DateTitle>
                                    Son düzenleme {dayjs(postData._createdAt).fromNow()}
                                </DateTitle>
                                <ReadTimeTitle>
                                    4 dk okuma süresi
                                </ReadTimeTitle>
                            </Col>
                        </Col>
                    </Row>
                    <BlockContent
                        blocks={postData.body}
                        imageOptions={{ w: 700, h: 800, fit: 'max' }}
                        projectId="nnice2kn"
                        dataset="production"
                        className="block-content"
                        serializers={serializers}
                    />
                </Col>
            </Container>
        </Container>
    )
}
export default Post;